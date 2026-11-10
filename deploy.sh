#!/usr/bin/env bash
# One-time deploy of this folder to GitHub Pages at https://saifriaz.tech
set -euo pipefail
cd "$(dirname "$0")"

gh repo create SaifRiaz3256/saifriaz.tech --public \
  --description "Personal profile site — saifriaz.tech" --homepage https://saifriaz.tech \
  --source . --remote origin --push
gh api -X POST repos/SaifRiaz3256/saifriaz.tech/pages -f "source[branch]=main" -f "source[path]=/"
gh api -X PUT repos/SaifRiaz3256/saifriaz.tech/pages -f cname=saifriaz.tech
echo "Deployed. Now add the DNS records, then enable 'Enforce HTTPS' in repo Settings → Pages."
