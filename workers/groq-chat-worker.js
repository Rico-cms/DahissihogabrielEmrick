const ALLOWED_ORIGINS = [
  "https://rico-cms.github.io",
  "null",
  "http://localhost:8787",
  "http://127.0.0.1:8787"
];

const PROFILE_CONTEXT = `
Tu es l'assistant du portfolio de Gabriel Emrick Dahissiho.
Réponds en français, avec un ton clair, concis et professionnel.
Ne prétends jamais être Gabriel. Tu aides simplement les visiteurs à comprendre son profil.

Informations fiables :
- Gabriel Emrick Dahissiho est basé à Abidjan.
- Il travaille à la croisée de la stratégie digitale, du product design, de l'UX/UI, du branding et de la transformation opérationnelle.
- Projets : JDIS — Digital System, CDCRB — Patrimoine, Africaine Vie, Le Petit Nokoué, The Busy Bee School, Lyz Digital.
- Parcours : Project Manager & UX/UI Designer chez Jalo Logistics, Directeur artistique chez SÆKUM, Product Designer chez Le Petit Nokoué.
- Outils : Jira, Notion, Figma, Trello, HubSpot, GitHub, VS Code, Adobe Suite, Google Ads, ChatGPT.
- Contact : dahissihogabriel@gmail.com, +225 05 96 48 93 43, LinkedIn, formulaire Tally.
- Si une question sort du cadre du portfolio, réponds brièvement et ramène vers le contact.
`;

function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers });
    }

    const { message } = await request.json().catch(() => ({}));
    if (!message || typeof message !== "string" || message.length > 900) {
      return Response.json({ error: "Invalid message" }, { status: 400, headers });
    }

    const aiResponse = await env.AI.run("@cf/meta/llama-3.2-1b-instruct", {
      messages: [
        { role: "system", content: PROFILE_CONTEXT },
        { role: "user", content: message }
      ],
      temperature: 0.35,
      max_tokens: 220
    });

    const answer = aiResponse.response?.trim() || "Je n'ai pas réussi à répondre clairement.";

    return Response.json({ answer }, { headers });
  }
};
