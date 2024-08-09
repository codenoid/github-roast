import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import lokalTunnel from 'lokal-vite-plugin';

export default defineConfig({
	plugins: [
		sveltekit(),
		lokalTunnel({
			tunnelName: 'GitHub Roast',
			lanAddress: 'github-roast.local'
		})
	]
});
