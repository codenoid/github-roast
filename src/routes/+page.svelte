<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import SvelteMarkdown from 'svelte-markdown';

	let username = '';
	let roast = '';
	let loading = false;
	let mounted = false;
	let selectedLanguage = 'english';

	const languages = [
		{ value: 'english', label: 'English' },
		{ value: 'french', label: 'Français (French)' },
		{ value: 'italian', label: 'Italiano (Italian)' },
		{ value: 'indonesian', label: 'Indonesian' },
		{ value: 'indian', label: 'हिंदी (Hindi)' },
		{ value: 'korean', label: '한국어 (Korean)' },
		{ value: 'japanese', label: '日本語 (Japanese)' },
		{ value: 'chinese', label: '中文 (Chinese)' },
		{ value: 'german', label: 'Deútsche (German)' },
		{ value: 'arabic', label: 'العربية (Arabic)' },
		{ value: 'vietnamese', label: 'Tiếng việt (Vietnamese)' },
		{ value: 'finnish', label: 'Suomi (Finnish)' },
		{ value: 'portuguese', label: 'Português (Portuguese)' },
		{ value: 'polish', label: 'język polski (Polish)' },
		{ value: 'traditionalChinese', label: '中文(臺灣) (Traditional Chinese)' }
	];

	onMount(() => {
		mounted = true;
	});

	async function handleRoast() {
		if (!username) return;

		loading = true;
		try {
			const response = await fetch('/llama', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, language: selectedLanguage })
			});

			if (!response.ok) {
				throw new Error('Failed to fetch roast');
			}

			const data = await response.json();
			roast = data.roast;
		} catch (error) {
			console.error('Error:', error);
			roast = 'Oops! Looks like our roasting machine is on a coffee break. Try again later!';
		} finally {
			loading = false;
		}
	}

	function handleKeyDown(event) {
		event.key === 'Enter' && handleRoast();
	}
</script>

<svelte:head>
	<title>GitHub Profile Roast 🔥🔥🔥</title>
</svelte:head>

<div class="container mx-auto p-4 max-w-md">
	<h1 class="text-3xl font-bold mb-4 text-center text-purple-600">GitHub Roaster</h1>

	<div class="mb-4">
		<input
			type="text"
			bind:value={username}
			placeholder="Enter GitHub username"
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
			disabled={loading}
			on:keydown={handleKeyDown}
		/>
	</div>

	<div class="mb-4">
		<select
			bind:value={selectedLanguage}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
			disabled={loading}
		>
			{#each languages as language}
				<option value={language.value}>{language.label}</option>
			{/each}
		</select>
	</div>

	<button
		on:click={handleRoast}
		class="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
		disabled={loading || !username}
	>
		{loading ? 'Roasting...' : 'Roast This GitHub!'}
	</button>

	{#if roast && mounted}
		<div class="mt-6 relative bg-gray-100 p-4 rounded-lg" transition:fade={{ duration: 300 }}>
			<div
				class="absolute top-0 left-4 -mt-2 w-0 h-0 border-8 border-transparent border-b-gray-100"
			></div>
			<p class="text-gray-800"><SvelteMarkdown source={roast} /></p>
		</div>
	{/if}

	<div class="mt-8 text-center text-sm text-gray-500">
		<p>&copy; 2024 github-roast.pages.dev</p>
		<p>
			Poke <a class="text-blue-500" target="_blank" href="https://x.com/rubi1945">Admin</a> if something
			goes wrong
		</p>
		<p>
			<a class="text-blue-500" target="_blank" href="https://github.com/codenoid/github-roast">Source code on GitHub</a>
		</p>
		<p>
			<a class="text-blue-500" target="_blank" href="https://github.com/codenoid/github-roast/issues/47">Permanently opt out and delete all roasts related to your GitHub account.</a>
		</p>
	</div>
</div>
