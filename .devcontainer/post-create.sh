#!/usr/bin/env bash
set -e

echo "=== Body Trainer — Codespaces Setup ==="

# Copy .env.example to .env if it doesn't already exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "✅  Created .env from .env.example"
  echo ""
  echo "⚠️  ACTION REQUIRED: Open .env and set your GROQ_API_KEY."
  echo "    Get a free key at https://console.groq.com"
  echo ""
else
  echo "✅  .env already exists — skipping copy"
fi

echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Open .env and set GROQ_API_KEY (https://console.groq.com)"
echo "  2. Run: docker compose up -d"
echo "  3. Open the forwarded port 3000 in your browser"
