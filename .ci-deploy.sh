export CLOUDFLARE_API_TOKEN=$CF_API_KEY >> /dev/null
export CLOUDFLARE_ACCOUNT_ID=$CF_ACCT_ID >> /dev/null
pnpm wrangler pages deploy frontend/dist --project-name=$CF_PAGES_NAME --branch=$CF_PAGES_BRANCH