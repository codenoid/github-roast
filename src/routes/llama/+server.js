import { OPENAI_API_KEY, GITHUB_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { json } from '@sveltejs/kit';

const client = new OpenAI({
	apiKey: OPENAI_API_KEY
});

let headers = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'User-Agent': 'github-roast.pages.dev'
};

const validLanguages = [
    'english',
    'indonesian',
    'indian',
    'chinese',
    'japanese',
    'korean',
    'france',
    'polish',
    'vietnamese'
];

export async function POST({ request, platform }) {
	let answerdebug = '';
	const { username, language } = await request.json();

	if (!validLanguages.includes(language)) {
        	return json({ error: 'invalid language specified, please pass a valid language.' }, { status: 400 });
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

	let prompt = `give a short and harsh roasting for the following github profile: ${username}. Here are the details: "${JSON.stringify(datas)}"`;
	switch (language) {
		case 'indonesian':
			prompt = `gunakan bahasa indonesia yang normal seperti manusia gaul, berikan roasting singkat dengan kejam dan menyindir dalam bahasa gaul untuk profile github berikut : ${username}. Berikut detailnya: "${JSON.stringify(datas)}"`;
			break;
		case 'indian':
			prompt = `इस गिटहब प्रोफाइल के लिए एक क्रूर और व्यंग्यात्मक रोस्टिंग गली भाषा में दें: ${username}। विवरण इस प्रकार है: "${JSON.stringify(datas)}"`;
			break;
		case 'chinese':
			prompt = `用中文俚语对以下GitHub个人资料进行短暂而残酷的讽刺：${username}。以下是详细信息: "${JSON.stringify(datas)}"`;
			break;
		case 'japanese':
			prompt = `以下のGitHubプロフィールに対して残酷で皮肉な短いローストをギャル語でしてください: ${username}。詳細は次の通りです: "${JSON.stringify(datas)}"`;
			break;
		case 'korean':
			prompt = `다음 GitHub 프로필에 대해 잔인하고 비꼬는 짧은 로스팅을 속어로 해주세요: ${username}. 자세한 내용은 다음과 같습니다: "${JSON.stringify(datas)}"`;
			break;
		case 'france':
			prompt = `fais une courte et cruelle critique sarcastique en argot pour le profil GitHub suivant : ${username}. Voici les détails : "${JSON.stringify(datas)}"`;
			break;
		case 'german':
			prompt = `machen sie eine grausame, kurze, harte und sarkastische Röstung auf Deutsch und verwenden Sie Wortspiele und Slang, um Humor in das folgende Github-Profil zu bringen : ${username}. Hier sind die Details : "${JSON.stringify(datas)}"`;
			break;
		case 'arabic':
			prompt = `.${JSON.stringify(datas)}: اليك هذه التفصيل .${username} :(GitHub) قدم سخرية قصيرة و قاصية على الملف الشخصي في`;
		case 'italian':
			prompt = `Criticami in modo sarcastico il seguente profilo GitHub: ${username}. Ecco alcuni dettagli: "${JSON.stringify(datas)}"`;
			break;
		case 'polish':
			prompt = `krótko i ostro skrytykuj poniższy profil GitHub: ${username}. Oto szczegóły: "${JSON.stringify(datas)}"`;
			break;
		case 'vietnamese':
			prompt = `Hãy đưa ra một lời châm chọc ngắn gọn và tàn nhẫn bằng tiếng lóng cho hồ sơ GitHub sau: ${username}. Đây là chi tiết: "${JSON.stringify(datas)}"`;
			break;
		case 'finnish':
			prompt = `Kirjoita lyhyt, julma ja sarkastinen arvostelu slangilla seuraavalle Github-profiilille: ${username}. Tässä on profiilin yksityiskohdat: "${JSON.stringify(datas)}"`;
      break;
		case 'portuguese':
			prompt = `faça uma crítica curta e dura para o seguinte perfil do github: ${username}. Aqui estão os detalhes: "${JSON.stringify(datas)}"`;
			break;
	}

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
					parseInt(new Date().getTime() / 1000),
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
