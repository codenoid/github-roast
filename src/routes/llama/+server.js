import { OPENAI_API_KEY, GITHUB_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { languages } from "../localization";
import { json } from '@sveltejs/kit';

const client = new OpenAI({
	apiKey: OPENAI_API_KEY
});

let headers = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'User-Agent': 'github-roast.pages.dev'
};

export async function POST({ request, platform }) {
	const { username, language } = await request.json();

	if (languages[language] == null) {
		return json(
			{ error: 'invalid language specified, please pass a valid language.' },
			{ status: 400 }
		);
	}

	if (GITHUB_API_KEY) {
		headers['Authorization'] = `token ${GITHUB_API_KEY}`;
	}

	var profileResponse = { status: 403 };
	var useToken = false;

	// Check if the token is not rate-limited
	try {
		let response = await fetch(`https://api.github.com/users/${username}`, {
			headers: headers
		});
		profileResponse = await response.json();
		if (response.ok) {
			useToken = true;
		} else {
			return json({ error: 'Our roast machine is in trouble' }, { status: 500 });
		}
	} catch (err) {
		console.log(err);
		let response = await fetch(`https://api.github.com/users/${username}`, { headers });
		profileResponse = await response.json();
	}

	// If token is rate-limited, fall back to no token
	if (!useToken) {
		delete headers['Authorization'];
	}

	let response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`, {
		headers: headers
	});
	const repoResponse = await response.json();

	let readmeResponse;
	try {
		response = await fetch(
			`https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
			{ headers: headers }
		);
		if (response.ok) {
			readmeResponse = await response.text();
		}
	} catch (error) {
		console.log(error);
		try {
			response = await fetch(
				`https://raw.githubusercontent.com/${username}/${username}/master/README.md`,
				{ headers: headers }
			);
			// answerdebug += (await response.text()) + ' 4\n';
			if (response.ok) {
				readmeResponse = await response.text();
			}
		} catch (error) {
			console.log(error);
			console.log('failed to get readme');
			readmeResponse = '';
		}
	}

	// https://github.com/bagusindrayana/roastgithub-api/blob/master/index.js
	const datas = {
		name: profileResponse.name,
		bio: profileResponse.bio,
		company: profileResponse.company,
		location: profileResponse.location,
		followers: profileResponse.followers,
		following: profileResponse.following,
		public_repos: profileResponse.public_repos,
		profile_readme: readmeResponse,
		last_15_repositories: repoResponse
			.map((repo) => ({
				name: repo.name,
				description: repo.description,
				language: repo.language,
				stargazers_count: repo.stargazers_count,
				open_issues_count: repo.open_issues_count,
				license: repo.license,
				fork: repo.fork
			}))
			.slice(0, 15)
	};

	let prompt = languages[language].buildPrompt(username, datas);

	// answerdebug += prompt + '\n';
	try {
		const completion = await client.chat.completions.create({
			model: 'gpt-4o',
			stream: false,
			messages: [
				{
					role: 'system',
					content:
						'You roast people github account based on their bio, name, readme, and repos as harsh and spicy as possible, and keep it short.'
				},
				{ role: 'user', content: prompt }
			]
		});

		const roast = completion.choices[0].message.content;
		try {
			await platform.env.DB.prepare(
				'INSERT INTO roasts (gh_username, response, created_at, country, ip_address) VALUES (?, ?, ?, ?, ?)'
			)
				.bind(
					username,
					roast,
					Math.floor(new Date().getTime() / 1000),
					request?.cf?.country || '',
					sha256(request.headers.get('cf-connecting-ip')) || ''
				)
				.run();
		} catch {}
		return json({ roast });
	} catch (error) {
		console.error('Error:', error);
		return json({ error: 'Failed to generate roast' }, { status: 500 });
	}
}

function sha256(str) {
	// Get the string as arraybuffer.
	var buffer = new TextEncoder('utf-8').encode(str);
	return crypto.subtle.digest('SHA-256', buffer).then(function (hash) {
		return hex(hash);
	});
}
