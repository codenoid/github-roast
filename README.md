# GitHub Roast

SvelteKit, Cloudflare Pages, Cloudflare D1, OpenAI gpt-4o-mini

## Setup

1. Create a new Cloudflare D1 database
2. `npx wrangler d1 import <database_name> --remote ./database.sql`
3. `npx wrangler d1 import <database_name> --local ./database.sql`
4. npm run dev

## Deployment

1. on Cloudflare Pages, deploy new app
2. Framework Preset -> SvelteKit
3. Use Connect Git instead of manual upload
4. the first deployment will fail, you need to update production ENV with encrypted value (this is CF Pages bug)