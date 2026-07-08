# LLM fallback pour le chatbot

Le chatbot du site fonctionne déjà en local avec des règles `if/else`.
Pour activer un vrai LLM quand aucune règle ne répond, il faut déployer un proxy sécurisé.

## Option préparée : Groq + Cloudflare Worker

1. Créer une clé API Groq.
2. Installer les dépendances :

```bash
npm install
```

3. Se connecter à Cloudflare :

```bash
npx wrangler login
```

4. Ajouter le secret Cloudflare :

```bash
npx wrangler secret put GROQ_API_KEY
```

5. Déployer le Worker :

```bash
npx wrangler deploy
```

6. Copier l'URL du Worker dans `script.js` :

```js
const LLM_ENDPOINT="https://ton-worker.ton-compte.workers.dev";
```

Le site GitHub Pages ne doit jamais contenir la clé API.
