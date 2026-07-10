# Nia on WhatsApp — daily check-in assistant

This Worker turns Nia into a WhatsApp assistant for Emrick.

## What it does

- Receives WhatsApp messages through Meta WhatsApp Cloud API webhooks.
- Uses Cloudflare Workers AI to generate replies.
- Helps Emrick with daily check-ins:
  - what was done;
  - today’s priorities;
  - blockers;
  - next action.
- Also answers broader questions about:
  - project management;
  - UX/UI;
  - product design;
  - branding;
  - digital strategy;
  - workflows and tools.

## Stack

- WhatsApp Business Platform / Cloud API
- Meta Webhooks
- Cloudflare Worker
- Cloudflare Workers AI
- LLM model: `@cf/openai/gpt-oss-120b`
- Wrangler

## Important limitation

WhatsApp does not allow a bot to freely message a user first at any time.

For true daily proactive reminders, you need:

1. User opt-in.
2. An approved WhatsApp message template.
3. A scheduled trigger that sends that template.

Without a template, the easiest free/simple flow is:

> Emrick messages “point” or “daily” to Nia, then Nia guides the daily check-in.

## Required Meta/WhatsApp values

You need these from Meta for Developers:

- WhatsApp Business App
- Phone Number ID — this is not the visible phone number. Meta gives it to you in the WhatsApp Cloud API dashboard.
- Permanent access token or system user token
- Webhook verify token — you choose this yourself

Emrick's visible number to connect later:

```txt
0165318224
```

Before using it with WhatsApp Cloud API, it must be attached to a Meta WhatsApp Business phone number and converted/validated in Meta's required international format.

Official Meta docs:

- Webhooks setup: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks/
- Send messages: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages/
- Cloud API get started: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/

## Local files

```txt
outputs/whatsapp-nia-worker/
├── src/index.js
├── wrangler.toml
├── package.json
└── README.md
```

## Setup

Install dependencies:

```bash
npm install
```

Login to Cloudflare:

```bash
npx wrangler login
```

Set secrets:

```bash
npx wrangler secret put WHATSAPP_TOKEN
npx wrangler secret put VERIFY_TOKEN
```

Edit `wrangler.toml` and replace:

```toml
PHONE_NUMBER_ID = "YOUR_WHATSAPP_PHONE_NUMBER_ID"
```

Deploy:

```bash
npx wrangler deploy
```

The deploy command returns a Worker URL like:

```txt
https://nia-whatsapp-daily.<your-subdomain>.workers.dev
```

## Meta webhook configuration

In Meta for Developers:

- Callback URL: your Worker URL
- Verify token: same value as `VERIFY_TOKEN`
- Subscribe to WhatsApp messages webhooks

## Example usage in WhatsApp

Send:

```txt
point
```

Nia should start guiding the daily check-in.

Send:

```txt
j’ai livré la maquette JDIS hier, aujourd’hui je dois finir le dashboard, blocage sur la validation client
```

Nia should summarize and suggest the next action.
