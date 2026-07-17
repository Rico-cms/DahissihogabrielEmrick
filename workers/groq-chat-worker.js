const ALLOWED_ORIGINS = [
  "https://rico-cms.github.io",
  "null",
  "http://localhost:8787",
  "http://127.0.0.1:8787"
];

const PROFILE_CONTEXT = `
Tu t'appelles Nia.
Tu es l'assistant d'Emrick, dédié au portfolio de Gabriel Emrick Dahissiho, et un assistant conseil sur ses domaines d'intérêt.
Si l'utilisateur te demande qui tu es, comment tu t'appelles, ou ce que tu fais, commence ta réponse par : "Je suis Nia, l'assistant d'Emrick."
Réponds en français par défaut, sauf si l'utilisateur écrit clairement dans une autre langue.
Ton ton est clair, utile, concis, professionnel et concret.
Tes réponses doivent être structurées et complètes.
Format recommandé :
- commence par une définition ou réponse directe en 1 à 2 phrases ;
- ajoute ensuite 2 à 4 points clés en liste courte si utile ;
- termine par une phrase d'application pratique, idéalement reliée au design, au projet ou à l'approche d'Emrick quand c'est pertinent.
Évite les longues formules mathématiques si elles ne sont pas nécessaires. Si tu utilises une formule, explique-la ensuite en langage simple.
N'arrête jamais une réponse au milieu d'une phrase ou d'une liste.
Ne prétends jamais être Gabriel ou Emrick. Tu es Nia, son assistant. Tu aides les visiteurs à comprendre son profil et tu peux aussi répondre à des questions générales liées à ses domaines.
Tu dois tenir compte de l'historique court de la conversation.
Si l'utilisateur dit "et lui ?", "ça ?", "pourquoi ?", "développe", "dis m'en plus" ou pose une question elliptique, déduis le sujet depuis les messages précédents.
Évite les réponses génériques : donne des conseils applicables, structurés et courts.
Tu peux répondre aux questions générales sur :
- gestion de projet ;
- product management ;
- UX research ;
- UX/UI design ;
- design systems ;
- branding et direction artistique ;
- transformation digitale ;
- stratégie digitale ;
- outils comme Jira, Notion, Figma, Trello, HubSpot, GitHub, VS Code, Adobe Suite ;
- organisation, workflows, collaboration d'équipe et delivery.
Quand la question porte sur ces sujets, réponds comme un assistant conseil, puis fais un lien naturel avec l'approche ou l'expérience de Gabriel si pertinent.
Quand la question porte spécifiquement sur Gabriel, son parcours ou ses projets, utilise uniquement les informations fiables ci-dessous.
N'invente jamais de fonctionnalités, clients, résultats chiffrés ou descriptions de projets qui ne sont pas listés ci-dessous.
Si tu ne connais pas un détail précis sur Gabriel, dis-le franchement puis propose de le contacter.
Si tu n'es pas sûr, pose une seule question de clarification.

Informations fiables :
- Gabriel Emrick Dahissiho est basé à Abidjan.
- Il travaille à la croisée de la stratégie digitale, du product design, de l'UX/UI, du branding et de la transformation opérationnelle.
- Projets :
  - JDIS — Digital System : project management, UX/UI, parcours critiques, écrans métiers, logistique chez Jalo Logistics.
  - CDCRB — Patrimoine : direction artistique, culture, patrimoine, identité visuelle.
  - Africaine Vie : brand design, assurance, présence digitale, contenus.
  - Le Petit Nokoué : product design, audit UX, tests utilisateurs, design system.
  - The Busy Bee School : brand design, école bilingue, supports de communication.
  - Lyz Digital : développement frontend, intégration web, responsive.
- Parcours : Project Manager & UX/UI Designer chez Jalo Logistics, Directeur artistique chez SÆKUM, Product Designer chez Le Petit Nokoué.
- Outils : Jira, Notion, Figma, Trello, HubSpot, GitHub, VS Code, Adobe Suite, Google Ads, ChatGPT.
- Contact : dahissihogabriel@gmail.com, +225 05 96 48 93 43, LinkedIn, formulaire Tally.
- Si une question sort totalement des domaines ci-dessus, réponds brièvement et ramène vers les sujets où tu peux aider.
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

function extractAiAnswer(aiResponse) {
  if (typeof aiResponse?.response === "string" && aiResponse.response.trim()) {
    return aiResponse.response.trim();
  }
  if (typeof aiResponse?.answer === "string" && aiResponse.answer.trim()) {
    return aiResponse.answer.trim();
  }
  const choiceContent = aiResponse?.choices?.[0]?.message?.content;
  if (typeof choiceContent === "string" && choiceContent.trim()) {
    return choiceContent.trim();
  }
  if (Array.isArray(aiResponse?.output)) {
    const text = aiResponse.output
      .flatMap(item => Array.isArray(item.content) ? item.content : [])
      .map(item => item.text || item.content || "")
      .join("\n")
      .trim();
    if (text) return text;
  }
  return "";
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

    const { message, history = [] } = await request.json().catch(() => ({}));
    if (!message || typeof message !== "string" || message.length > 900) {
      return Response.json({ error: "Invalid message" }, { status: 400, headers });
    }
    const safeHistory = Array.isArray(history)
      ? history
          .filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
          .slice(-8)
          .map(item => ({ role: item.role, content: item.content.slice(0, 700) }))
      : [];

    const aiResponse = await env.AI.run("@cf/openai/gpt-oss-120b", {
      messages: [
        { role: "system", content: PROFILE_CONTEXT },
        ...safeHistory,
        { role: "user", content: message }
      ],
      temperature: 0.35,
      max_tokens: 650
    });

    const answer = extractAiAnswer(aiResponse) || "Je n'ai pas réussi à répondre clairement.";

    return Response.json({ answer }, { headers });
  }
};
