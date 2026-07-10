const PROFILE_CONTEXT = `
Tu t'appelles Nia.
Tu es l'assistant WhatsApp d'Emrick.
Ta mission principale est d'aider Emrick à faire ses points journaliers, clarifier ses priorités, organiser ses projets et réfléchir sur la gestion de projet, l'UX/UI, le product design, le branding, les workflows et la stratégie digitale.

Ton style :
- français par défaut ;
- court, chaleureux, direct ;
- pas de longs pavés sur WhatsApp ;
- pose une question à la fois quand tu accompagnes un point journalier ;
- aide Emrick à sortir avec des priorités concrètes.

Contexte fiable sur Emrick :
- Emrick est basé à Abidjan.
- Il travaille à la croisée de la stratégie digitale, du product design, de l'UX/UI, du branding et de la transformation opérationnelle.
- Projets : JDIS, CDCRB, Africaine Vie, Le Petit Nokoué, The Busy Bee School, Lyz Digital.
- Outils : Jira, Notion, Figma, Trello, HubSpot, GitHub, VS Code, Adobe Suite, Google Ads, ChatGPT.

Flow conseillé pour "point", "daily", "bilan", "standup" :
1. Demande ce qui a été fait depuis le dernier point.
2. Demande les 3 priorités du jour.
3. Demande les blocages.
4. Propose une synthèse courte : Fait / À faire / Blocages / Next action.
`;

function json(data, status = 200) {
  return Response.json(data, { status });
}

function extractTextMessage(body) {
  const value = body?.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];
  if (!message || message.type !== "text") return null;
  return {
    from: message.from,
    text: message.text?.body || "",
    messageId: message.id
  };
}

function isDailyPointIntent(text) {
  const q = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ["point", "daily", "standup", "bilan", "jour", "priorite", "priorites", "blocage"].some(word => q.includes(word));
}

async function generateNiaReply(env, text) {
  const prompt = isDailyPointIntent(text)
    ? `${text}\n\nL'utilisateur veut probablement faire son point journalier. Guide-le avec une seule question claire ou fais une synthèse si les informations sont déjà suffisantes.`
    : text;

  const response = await env.AI.run("@cf/openai/gpt-oss-120b", {
    messages: [
      { role: "system", content: PROFILE_CONTEXT },
      { role: "user", content: prompt }
    ],
    temperature: 0.35,
    max_tokens: 260
  });

  return extractAiAnswer(response) || "Je suis là. Dis-moi ce que tu veux clarifier aujourd’hui.";
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

async function sendWhatsAppMessage(env, to, text) {
  const url = `https://graph.facebook.com/${env.GRAPH_API_VERSION}/${env.PHONE_NUMBER_ID}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        preview_url: false,
        body: text.slice(0, 3500)
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp send failed: ${errorText}`);
  }

  return response.json();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === env.VERIFY_TOKEN) {
        return new Response(challenge || "", { status: 200 });
      }

      return new Response("Verification failed", { status: 403 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json().catch(() => null);
    const inbound = extractTextMessage(body);

    if (!inbound) {
      return json({ ok: true, ignored: true });
    }

    try {
      const reply = await generateNiaReply(env, inbound.text);
      await sendWhatsAppMessage(env, inbound.from, reply);
      return json({ ok: true });
    } catch (error) {
      console.error(error);
      return json({ ok: false, error: "reply_failed" }, 500);
    }
  }
};
