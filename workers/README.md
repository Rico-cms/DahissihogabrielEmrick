# LLM fallback gratuit pour le chatbot

Le chatbot du site fonctionne déjà en local avec des règles `if/else`.
Quand aucune règle ne répond, il appelle ce Cloudflare Worker.

## Option active : Cloudflare Workers AI

Cette option ne nécessite pas de clé API externe. Elle utilise l'allocation gratuite Cloudflare Workers AI.

1. Installer les dépendances :

```bash
npm install
```

2. Se connecter à Cloudflare :

```bash
npx wrangler login
```

3. Déployer le Worker :

```bash
npx wrangler deploy
```

4. Copier l'URL du Worker dans `script.js` :

```js
const LLM_ENDPOINT="https://ton-worker.ton-compte.workers.dev";
```
