(() => {
  const root = document.querySelector(".mini-chat");
  if (!root) return;

  const toggle = root.querySelector(".chat-toggle");
  const panel = root.querySelector(".chat-panel");
  const close = root.querySelector(".chat-close");
  const messages = root.querySelector(".chat-messages");
  const suggestions = root.querySelector(".chat-suggestions");
  const form = root.querySelector(".chat-form");
  const input = root.querySelector("#chat-input");
  const inputLabel = root.querySelector('label[for="chat-input"]');
  const submit = form.querySelector("button");
  const endpoint = "https://gabriel-portfolio-chat.dahissihogabriel.workers.dev";
  const storageKey = "nia-unifier-session-v1";
  let busy = false;
  let history = [];

  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
    if (Array.isArray(stored)) history = stored.slice(-14);
  } catch (_) {}

  const copy = {
    fr: {
      welcome: "Bonjour, je suis Nia. Je peux vous aider à comprendre le profil d’Emrick, sa méthode et les projets à explorer.",
      suggestions: ["Pitch en 20 secondes", "Quels projets voir ?", "Pourquoi le recruter ?", "Comment travaille-t-il ?"],
      thinking: "Je réfléchis…",
      unavailable: "Le service IA est momentanément indisponible. Je peux tout de même répondre sur le profil, les projets, la méthode ou le contact d’Emrick.",
      placeholder: "Posez une question à Nia…",
      send: "Envoyer"
    },
    en: {
      welcome: "Hello, I’m Nia. I can help you understand Emrick’s profile, working method and the projects worth exploring.",
      suggestions: ["20-second pitch", "Which projects should I see?", "Why hire him?", "How does he work?"],
      thinking: "Thinking…",
      unavailable: "The AI service is temporarily unavailable. I can still answer questions about Emrick’s profile, projects, method or contact details.",
      placeholder: "Ask Nia a question…",
      send: "Send"
    }
  };

  const locale = () => document.documentElement.lang === "en" ? "en" : "fr";
  const normalize = value => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const save = () => sessionStorage.setItem(storageKey, JSON.stringify(history.slice(-14)));
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"})[character]);
  const inline = value => escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");

  function formatAnswer(value) {
    const lines = String(value || "").replace(/\r\n/g, "\n").trim().split("\n");
    const html = [];
    let list = [];
    const flush = () => {
      if (!list.length) return;
      html.push(`<ul>${list.map(item => `<li>${inline(item)}</li>`).join("")}</ul>`);
      list = [];
    };
    lines.forEach(raw => {
      const line = raw.trim();
      if (!line) return flush();
      const heading = line.match(/^#{1,4}\s+(.+)/);
      const bullet = line.match(/^[-*•]\s+(.+)/);
      if (heading) { flush(); html.push(`<strong class="chat-heading">${inline(heading[1])}</strong>`); }
      else if (bullet) list.push(bullet[1]);
      else { flush(); html.push(`<span>${inline(line)}</span>`); }
    });
    flush();
    return html.join("");
  }

  function addMessage(text, type = "bot") {
    const message = document.createElement("p");
    message.className = type;
    if (type.includes("bot")) message.innerHTML = formatAnswer(text);
    else message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function localAnswer(question) {
    const q = normalize(question);
    const en = locale() === "en";
    if (/bonjour|salut|hello|hey/.test(q)) return en
      ? "Hello — I’m Nia, Emrick’s portfolio assistant. Ask me about his profile, projects, working method or availability."
      : "Bonjour — je suis Nia, l’assistante du portfolio d’Emrick. Interrogez-moi sur son profil, ses projets, sa méthode ou sa disponibilité.";
    if (/pitch|20.second|presente|profil|who is|qui est/.test(q)) return en
      ? "Emrick is an IT Project Manager who connects business needs, users and technical teams. His strength is turning ambiguity into clear decisions and a product that can actually be delivered."
      : "Emrick est un IT Project Manager qui relie besoins métier, utilisateurs et équipes techniques. Sa force : transformer le flou en décisions claires et en produit réellement livrable.";
    if (/projet|project|portfolio|voir|see/.test(q)) return en
      ? "Start with **Slotly** for product structuring, **Africa Digital Pulse** for editorial clarity, and **Rabbit Hole** for learning experience. The personal lab then shows his broader experimentation."
      : "Commencez par **Slotly** pour la structuration produit, **Africa Digital Pulse** pour la clarté éditoriale et **Rabbit Hole** pour l’expérience d’apprentissage. Le laboratoire personnel montre ensuite l’étendue de ses expérimentations.";
    if (/recrut|hire|valeur|value|why him|pourquoi lui/.test(q)) return en
      ? "Hire him when a project needs someone able to understand the business, structure decisions and keep product, design and technical execution aligned through delivery."
      : "Son intérêt apparaît lorsqu’un projet exige de comprendre le métier, structurer les décisions et garder produit, design et exécution technique alignés jusqu’à la livraison.";
    if (/methode|method|travail|work|process/.test(q)) return en
      ? "His method has three moves: **understand** the real work, **structure** needs and decisions, then **move delivery forward** with the teams."
      : "Sa méthode tient en trois gestes : **comprendre** le travail réel, **structurer** les besoins et les décisions, puis **faire avancer la livraison** avec les équipes.";
    if (/contact|email|mail|telephone|phone|rdv|meeting|creneau/.test(q)) return en
      ? "You can reach Emrick at **dahissihogabriel@gmail.com**, on LinkedIn, or use the booking link in the contact section."
      : "Vous pouvez joindre Emrick à **dahissihogabriel@gmail.com**, sur LinkedIn ou utiliser le lien de réservation dans la section contact.";
    return null;
  }

  async function askEndpoint(question) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      signal: controller.signal,
      body: JSON.stringify({
        message: question,
        locale: locale(),
        history: history.slice(-12),
        conversationState: {source: "bookemrick.online", currentPage: location.pathname}
      })
    }).finally(() => clearTimeout(timeout));
    if (!response.ok) throw new Error(`NIA_HTTP_${response.status}`);
    const data = await response.json();
    const answer = String(data.answer || data.response || "").trim();
    if (!answer) throw new Error("NIA_EMPTY_RESPONSE");
    return answer;
  }

  function renderSuggestions() {
    const en = locale() === "en";
    suggestions.replaceChildren(...copy[locale()].suggestions.map(label => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => ask(label));
      return button;
    }));
    input.placeholder = copy[locale()].placeholder;
    if (inputLabel) inputLabel.textContent = en ? "Your question" : "Votre question";
    input.setAttribute("aria-label", en ? "Your question" : "Votre question");
    submit.textContent = copy[locale()].send;
    const welcome = root.querySelector(".chat-welcome");
    if (welcome && history.length === 0) welcome.innerHTML = formatAnswer(copy[locale()].welcome);
    toggle.setAttribute("aria-label", en ? "Open Nia assistant" : "Ouvrir l’assistante Nia");
    close.setAttribute("aria-label", en ? "Close Nia" : "Fermer Nia");
    suggestions.setAttribute("aria-label", en ? "Suggested questions" : "Questions suggérées");
  }

  async function ask(question) {
    if (busy || !question.trim()) return;
    busy = true;
    input.disabled = true;
    submit.disabled = true;
    addMessage(question, "user");
    const local = localAnswer(question);
    const waiting = addMessage(copy[locale()].thinking, "bot thinking");
    try {
      const answer = local || await askEndpoint(question);
      waiting.className = "bot";
      waiting.innerHTML = formatAnswer(answer);
      history.push({role: "user", content: question}, {role: "assistant", content: answer});
      history = history.slice(-14);
      save();
    } catch (error) {
      waiting.className = "bot";
      waiting.innerHTML = formatAnswer(copy[locale()].unavailable);
      console.warn("Nia unavailable", error);
    } finally {
      busy = false;
      input.disabled = false;
      submit.disabled = false;
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }

  function setOpen(open) {
    root.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    if (open) { renderSuggestions(); setTimeout(() => input.focus(), 120); }
  }

  toggle.addEventListener("click", () => setOpen(!root.classList.contains("open")));
  close.addEventListener("click", () => { setOpen(false); toggle.focus(); });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    ask(question);
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && root.classList.contains("open")) setOpen(false); });
  document.querySelector("#lang, .language")?.addEventListener("click", () => setTimeout(renderSuggestions, 0));
  renderSuggestions();
})();
