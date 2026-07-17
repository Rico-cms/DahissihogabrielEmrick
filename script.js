const projects={
  jdis:{role:"Project Manager & UX/UI",title:"JDIS — Digital System",intro:"Chez JALO Logistics, je structure et pilote des solutions digitales destinées à optimiser la chaîne logistique.",points:["Gouvernance du projet et consolidation des besoins métiers.","Tableaux de bord exécutifs, calendriers de livraison et reporting.","Parcours critiques et optimisation des écrans métiers.","Modernisation d’un réseau logistique présent dans une dizaine de pays."]},
  cdcrb:{role:"Direction artistique",title:"CDCRB — Patrimoine",intro:"Une identité contemporaine pour valoriser l’héritage des danses cérémonielles et royales du Bénin.",points:["Modernisation respectueuse de l’ancrage historique.","Conception de la ligne graphique globale.","Harmonisation de l’identité pour renforcer le rayonnement culturel."]},
  africaine:{role:"Brand design",title:"Africaine Vie Bénin",intro:"Refonte de la présence digitale et valorisation des offres d’une institution majeure de l’assurance.",points:["Pilotage des assets sociaux et print.","Système de contenus adapté aux différents canaux.","Engagement accru et meilleure reconnaissance de marque."]},
  nokoue:{role:"Product design",title:"Le Petit Nokoué",intro:"Optimisation de l’expérience utilisateur d’une plateforme digitale en croissance.",points:["Audit des interfaces et identification des frictions.","Collaboration directe avec les équipes de développement.","Évolution du design system pour gagner en cohérence."]},
  busybee:{role:"Brand design",title:"The Busy Bee School",intro:"Modernisation de l’image d’un établissement bilingue et clarification de sa communication.",points:["Uniformisation des supports de communication.","Contenus sociaux pensés pour les parents d’élèves.","Visibilité accrue auprès des publics francophones et anglophones."]},
  lyz:{role:"Développement frontend",title:"Lyz Digital",intro:"Intégration d’interfaces web fidèles, rapides et adaptées à toutes les tailles d’écran.",points:["Intégration HTML, CSS et JavaScript.","Optimisation de la performance et du responsive.","Collaboration étroite avec les équipes design."]}
};
const dialog=document.querySelector("#project-dialog");
document.querySelectorAll("[data-project]").forEach(button=>button.addEventListener("click",()=>{
  const project=projects[button.dataset.project];
  document.querySelector("#dialog-role").textContent=project.role;
  document.querySelector("#dialog-title").textContent=project.title;
  document.querySelector("#dialog-intro").textContent=project.intro;
  document.querySelector("#dialog-points").innerHTML=project.points.map(point=>`<li>${point}</li>`).join("");
  dialog.showModal();
}));
document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
document.querySelector("#year").textContent=new Date().getFullYear();
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach((element,index)=>{
    element.style.setProperty("--reveal-delay",`${Math.min(index%6*.055,.22)}s`);
    observer.observe(element);
  });
}else document.querySelectorAll(".reveal").forEach(element=>element.classList.add("visible"));

const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
const progress=document.querySelector(".scroll-progress");
addEventListener("scroll",()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;
},{passive:true});

if(!reducedMotion){
  let pointerFrame=null;
  addEventListener("pointermove",event=>{
    if(pointerFrame)return;
    pointerFrame=requestAnimationFrame(()=>{
      document.body.style.setProperty("--mx",`${event.clientX}px`);
      document.body.style.setProperty("--my",`${event.clientY}px`);
      pointerFrame=null;
    });
  },{passive:true});

  document.querySelectorAll(".pill,.hero-aside a,.contact-links a,.credential-controls button,.project-more button,.geo-map").forEach(element=>{
    element.addEventListener("pointermove",event=>{
      if(matchMedia("(pointer: coarse)").matches)return;
      const rect=element.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      element.style.transform=`translate(${x*8}px,${y*6}px)`;
    });
    element.addEventListener("pointerleave",()=>{element.style.transform=""});
  });
}

const geoCard=document.querySelector("[data-location-card]");
if(geoCard){
  const geoMotion=geoCard.querySelector(".geo-screen img");
  if(reducedMotion&&geoMotion)geoMotion.src="assets/regional-signal-still.png";
  const geoStates={
    abidjan:{
      title:"Abidjan",
      copy:"Base actuelle : là où Emrick structure, pilote et transforme les projets digitaux.",
      action:"Voir Bénin",
      x:"24%",
      y:"62%"
    },
    benin:{
      title:"Bénin",
      copy:"Trajectoire et racines créatives : patrimoine, marques, produits et collaborations entre Cotonou et la région.",
      action:"Voir Abidjan",
      x:"72%",
      y:"47%"
    }
  };
  let activeGeo="abidjan";
  const title=geoCard.querySelector("[data-location-title]");
  const copy=geoCard.querySelector("[data-location-copy]");
  const action=geoCard.querySelector("[data-location-action]");
  const toggle=geoCard.querySelector("[data-location-toggle]");
  const setGeo=next=>{
    activeGeo=next;
    const state=geoStates[activeGeo];
    title.textContent=state.title;
    copy.textContent=state.copy;
    action.textContent=state.action;
    toggle.style.setProperty("--geo-x",state.x);
    toggle.style.setProperty("--geo-y",state.y);
    geoCard.querySelectorAll("[data-map-shape]").forEach(shape=>{
      shape.classList.toggle("active",shape.dataset.mapShape===activeGeo);
    });
  };
  toggle.addEventListener("click",()=>setGeo(activeGeo==="abidjan"?"benin":"abidjan"));
  if(!reducedMotion)setInterval(()=>setGeo(activeGeo==="abidjan"?"benin":"abidjan"),5000);
}

document.querySelectorAll(".expertise-row").forEach(row=>{
  const toggle=()=>{
    const opening=!row.classList.contains("open");
    document.querySelectorAll(".expertise-row").forEach(item=>item.classList.remove("open"));
    if(opening)row.classList.add("open");
  };
  row.addEventListener("click",toggle);
  row.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();toggle()}});
});

const stats=document.querySelector(".stats");
const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.querySelectorAll("[data-count]").forEach(number=>{
    const target=Number(number.dataset.count);
    const suffix=number.dataset.suffix||"";
    if(reducedMotion){number.textContent=target+suffix;return}
    const started=performance.now();
    const update=now=>{
      const t=Math.min(1,(now-started)/900);
      const eased=1-Math.pow(1-t,3);
      number.textContent=Math.round(target*eased)+suffix;
      if(t<1)requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
  countObserver.unobserve(entry.target);
}),{threshold:.5});
countObserver.observe(stats);

const stage=document.querySelector(".hero-stage");
stage.addEventListener("pointermove",event=>{
  if(reducedMotion)return;
  const rect=stage.getBoundingClientRect();
  const x=(event.clientX-rect.left)/rect.width;
  const y=(event.clientY-rect.top)/rect.height;
  stage.style.setProperty("--stage-x",`${x*100}%`);
  stage.style.setProperty("--stage-y",`${y*100}%`);
  stage.querySelector(".monogram").style.transform=`translate(${(x-.5)*18}px,${(y-.5)*14}px) rotate(${(x-.5)*3}deg)`;
  stage.querySelector(".orbit.one").style.transform=`rotate(${-18+(x-.5)*10}deg) translate(${(x-.5)*10}px,${(y-.5)*8}px)`;
  stage.querySelector(".orbit.two").style.transform=`rotate(${-18-(x-.5)*8}deg) translate(${-(x-.5)*12}px,${-(y-.5)*8}px)`;
});
stage.addEventListener("pointerleave",()=>{
  stage.querySelector(".monogram").style.transform="";
  stage.querySelectorAll(".orbit").forEach(orbit=>orbit.style.transform="");
});

const projectCursor=document.querySelector(".project-cursor");
if(!matchMedia("(pointer: coarse)").matches){
  addEventListener("pointermove",event=>{projectCursor.style.left=`${event.clientX}px`;projectCursor.style.top=`${event.clientY}px`});
  document.querySelectorAll(".project").forEach(card=>{
    card.addEventListener("pointerenter",()=>projectCursor.classList.add("active"));
    card.addEventListener("pointerleave",()=>{projectCursor.classList.remove("active");card.style.transform=""});
    card.addEventListener("pointermove",event=>{
      if(reducedMotion)return;
      const rect=card.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      card.style.setProperty("--px",`${(x+.5)*100}%`);
      card.style.setProperty("--py",`${(y+.5)*100}%`);
      card.style.transform=`perspective(900px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-5px)`;
    });
  });
}

const chaosWord=document.querySelector("#chaos-word");
const particleCanvas=document.querySelector("#particle-canvas");
const particleContext=particleCanvas.getContext("2d");
let particleAnimation=null;

function sizeParticleCanvas(){
  const ratio=Math.min(devicePixelRatio||1,2);
  particleCanvas.width=innerWidth*ratio;
  particleCanvas.height=innerHeight*ratio;
  particleContext.setTransform(ratio,0,0,ratio,0,0);
}
sizeParticleCanvas();
addEventListener("resize",sizeParticleCanvas);

function transformChaos(){
  if(reducedMotion||particleAnimation)return;
  const rect=chaosWord.getBoundingClientRect();
  const style=getComputedStyle(chaosWord);
  const columns=Math.max(18,Math.round(rect.width/5));
  const rows=Math.max(8,Math.round(rect.height/6));
  const particles=[];
  for(let row=0;row<rows;row++){
    for(let column=0;column<columns;column++){
      if(Math.random()<.38)continue;
      const x=rect.left+(column+.5)*rect.width/columns;
      const y=rect.top+(row+.5)*rect.height/rows;
      const angle=Math.atan2(y-(rect.top+rect.height/2),x-(rect.left+rect.width/2))+(.5-Math.random())*.9;
      const distance=45+Math.random()*130;
      particles.push({x,y,homeX:x,homeY:y,awayX:x+Math.cos(angle)*distance,awayY:y+Math.sin(angle)*distance,size:1.5+Math.random()*3,spin:Math.random()*Math.PI,color:Math.random()>.18?style.color:"#ff4d2e"});
    }
  }
  chaosWord.classList.add("dispersing");
  const start=performance.now();
  particleAnimation=true;
  const frame=now=>{
    const elapsed=now-start;
    const outward=Math.min(1,elapsed/650);
    const returning=Math.max(0,Math.min(1,(elapsed-750)/750));
    const scatter=returning>0?1-(1-Math.pow(1-returning,3)):1-Math.pow(1-outward,3);
    particleContext.clearRect(0,0,innerWidth,innerHeight);
    particles.forEach(particle=>{
      const x=particle.homeX+(particle.awayX-particle.homeX)*scatter;
      const y=particle.homeY+(particle.awayY-particle.homeY)*scatter+Math.sin(elapsed*.01+particle.spin)*4*scatter;
      particleContext.globalAlpha=returning>.78?(1-returning)*4.5:1;
      particleContext.fillStyle=particle.color;
      particleContext.fillRect(x,y,particle.size,particle.size);
    });
    particleContext.globalAlpha=1;
    if(elapsed<1500)requestAnimationFrame(frame);
    else{particleContext.clearRect(0,0,innerWidth,innerHeight);chaosWord.classList.remove("dispersing");particleAnimation=null}
  };
  requestAnimationFrame(frame);
}
chaosWord.addEventListener("click",transformChaos);
chaosWord.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();transformChaos()}});

document.querySelectorAll("[data-cert-filter]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-cert-filter]").forEach(item=>item.classList.remove("active"));
  button.classList.add("active");
  const filter=button.dataset.certFilter;
  document.querySelectorAll("[data-cert]").forEach((card,index)=>{
    const visible=filter==="all"||card.dataset.cert===filter;
    card.classList.toggle("filtered-out",!visible);
    if(visible&&!reducedMotion){
      card.animate([{opacity:0,transform:"translateY(12px)"},{opacity:1,transform:"none"}],{duration:320,delay:index*22,easing:"cubic-bezier(.16,1,.3,1)"});
    }
  });
}));

const miniChat=document.querySelector(".mini-chat");
const chatToggle=document.querySelector(".chat-toggle");
const chatPanel=document.querySelector("#chat-panel");
const chatClose=document.querySelector(".chat-close");
const chatMessages=document.querySelector("#chat-messages");
const chatForm=document.querySelector("#chat-form");
const chatInput=document.querySelector("#chat-input");
const LLM_ENDPOINT="https://gabriel-portfolio-chat.dahissihogabriel.workers.dev";
const chatHistory=[];
const profileIntentWords=["gabriel","emrick","il ","lui","son ","ses ","profil","portfolio","cv","experience","parcours","competence","expertise"];
const defaultSuggestions=["Pitch en 20 secondes","Pourquoi le recruter ?","Quel projet prouve son niveau ?","Comment le contacter ?"];

function isAboutProfile(q){
  return profileIntentWords.some(word=>q.includes(word));
}

function normalizeQuestion(text){
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w\s+@.]/g," ").replace(/\s+/g," ").trim();
}

function answerQuestion(question){
  const q=normalizeQuestion(question);
  if(!q)return {source:"local",text:"Pose-moi une question directe : profil, projets, recrutement, UX/UI, gestion de projet ou contact. Je te réponds court, clair, utile."};
  if(q.includes("pina colada")||q.includes("pinacolada")||q.includes("piña colada")){
    return {source:"local",text:"Voici une recette simple de piña colada pour 1 verre.\n\n**Ingrédients**\n- 60 ml de rhum blanc\n- 90 ml de jus d’ananas\n- 30 ml de crème de coco\n- Une poignée de glaçons\n- Optionnel : tranche d’ananas ou cerise pour décorer\n\n**Préparation**\n- Mets le rhum, le jus d’ananas, la crème de coco et les glaçons dans un blender.\n- Mixe jusqu’à obtenir une texture lisse et légèrement mousseuse.\n- Verse dans un grand verre, puis ajoute la décoration si tu veux.\n\nVersion sans alcool : retire le rhum et ajoute un peu plus de jus d’ananas ou de lait de coco. Simple, tropical, efficace."};
  }
  if(q.includes("golden ratio")||q.includes("ratio d or")||q.includes("nombre d or")||q.includes("section doree")||q.includes("proportion doree")){
    return {source:"local",text:"**Je suis Nia, l’assistant d’Emrick.**\n\nLe golden ratio, ou nombre d’or, est une proportion d’environ 1,618 utilisée pour créer une relation harmonieuse entre deux tailles : par exemple une grande zone et une zone plus petite.\n\n- En design, il aide à organiser les rapports entre titres, textes, marges, images et colonnes.\n- Il ne sert pas à “faire joli” automatiquement : il donne surtout une base de composition équilibrée.\n- Emrick peut l’utiliser pour structurer une interface, hiérarchiser l’information et éviter que les blocs semblent posés au hasard.\n- Sur son portfolio, l’idée se retrouve surtout dans les grands contrastes de taille, les espaces négatifs, les colonnes asymétriques et la respiration entre les sections.\n\nConcrètement : Emrick ne l’utilise pas comme une formule rigide, mais comme une logique de proportion pour guider le regard et rendre une page plus lisible."};
  }
  if(q.includes("pitch")||q.includes("20 secondes")||q.includes("resume")||q.includes("resumer")||q.includes("presente")||q.includes("profil")){
    return {source:"local",text:"Pitch rapide : Emrick est un IT Project Manager hybride — assez structuré pour piloter, assez designer pour rendre les choses utilisables, assez créatif pour donner une direction. Sa force : transformer du flou en système clair, livrable et compréhensible."};
  }
  if(q.includes("recruter")||q.includes("embaucher")||q.includes("choisir")||q.includes("pourquoi lui")||q.includes("valeur")){
    return {source:"local",text:"Pourquoi le recruter : parce qu’il ne reste pas coincé dans une seule case. Il peut cadrer un besoin, parler métier, organiser un workflow, challenger une interface et garder le projet orienté résultat. C’est rare chez les profils purement design ou purement gestion."};
  }
  if(q.includes("niveau")||q.includes("preuve")||q.includes("meilleur projet")||q.includes("projet prouve")||q.includes("projet fort")){
    return {source:"local",text:"Le projet le plus démonstratif est JDIS : il combine pilotage, compréhension métier, UX/UI et transformation opérationnelle. Pour la sensibilité produit pure, Le Petit Nokoué est très parlant. Pour la direction créative, CDCRB montre son sens de l’identité."};
  }
  if(q.includes("bonjour")||q.includes("salut")||q.includes("hello")||q.includes("hey")){
    return {source:"local",text:"Salut — je suis Nia. Je peux te faire gagner du temps : demande-moi son pitch, ses projets les plus solides, pourquoi le recruter, ou comment le contacter."};
  }
  if(q.includes("disponible")||q.includes("availability")||q.includes("recrute")||q.includes("mission")||q.includes("freelance")){
    return {source:"local",text:"Oui. Emrick est basé à Abidjan et ouvert à des opportunités où il peut structurer, piloter et améliorer des produits ou systèmes digitaux. Le bon terrain pour lui : projet ambitieux, besoin flou, équipe à aligner, résultat à livrer."};
  }
  if(q.includes("contact")||q.includes("email")||q.includes("mail")||q.includes("telephone")||q.includes("appel")||q.includes("rdv")||q.includes("creneau")){
    return {source:"local",text:"Contact direct : dahissihogabriel@gmail.com. Téléphone : +225 05 96 48 93 43. Le plus simple : utiliser le bouton de réservation du site si tu veux cadrer un échange proprement."};
  }
  if((q.includes("lequel")||q.includes("quel projet")||q.includes("projet"))&&(q.includes("ux")||q.includes("ui")||q.includes("produit")||q.includes("product"))&&isAboutProfile(q)){
    return {source:"local",text:"Pour l’UX/UI : Le Petit Nokoué montre l’audit, les frictions et le design system. JDIS montre une UX plus opérationnelle : écrans métiers, parcours critiques, besoin de clarté dans un contexte logistique."};
  }
  if(q.includes("portfolio")||q.includes("jdis")||q.includes("africaine")||q.includes("nokoue")||q.includes("busy")||q.includes("lyz")||(q.includes("projet")&&isAboutProfile(q))){
    return {source:"local",text:"Lecture rapide des projets : JDIS = pilotage + produit + logistique. Le Petit Nokoué = UX/product design. CDCRB = direction artistique culturelle. Africaine Vie et Busy Bee = branding appliqué. Lyz Digital = exécution frontend."};
  }
  if(q.includes("competence")||q.includes("expertise")||((q.includes("ux")||q.includes("ui")||q.includes("design")||q.includes("branding")||q.includes("strategie"))&&isAboutProfile(q))){
    return {source:"local",text:"Ses compétences fortes : 1) cadrer et piloter, 2) transformer un besoin en expérience utilisable, 3) donner une direction visuelle cohérente. Le point intéressant, c’est la combinaison des trois."};
  }
  if((q.includes("outil")||q.includes("tools")||q.includes("figma")||q.includes("jira")||q.includes("notion")||q.includes("github")||q.includes("adobe"))&&isAboutProfile(q)){
    return {source:"local",text:"Outils : Jira, Notion, Figma, Trello, HubSpot, GitHub, VS Code, Adobe Suite, Google Ads et ChatGPT. Mais le vrai sujet n’est pas l’outil : c’est sa capacité à mettre de l’ordre dans le travail."};
  }
  if(q.includes("parcours")||q.includes("experience")||q.includes("cv")||q.includes("jalo")||q.includes("saekum")){
    return {source:"local",text:"Parcours : Jalo Logistics pour le project management et la transformation digitale ; SÆKUM pour la direction artistique ; Le Petit Nokoué pour le product design. C’est ce mélange qui construit son profil hybride."};
  }
  if(q.includes("certification")||q.includes("certificat")||q.includes("diplome")||q.includes("formation")){
    return {source:"local",text:"Il a 15 certifications visibles : IA, project/product management, agile, marketing digital, design web, Git/GitHub et Adobe Photoshop. Ça montre surtout une logique d’apprentissage continu."};
  }
  if(q.includes("localisation")||q.includes("ville")||q.includes("abidjan")||q.includes("cotonou")||q.includes("ou est")){
    return {source:"local",text:"Emrick est basé à Abidjan, avec une trajectoire entre Abidjan et Cotonou. Son terrain naturel : projets digitaux et créatifs en Afrique de l’Ouest."};
  }
  if(q.includes("chaos")||q.includes("animation")||q.includes("interactif")){
    return {source:"local",text:"Petit indice : clique sur le mot « chaos » dans le hero. Le site garde des micro-interactions utiles, sans détour par une expérience 3D instable."};
  }
  if(q.includes("gestion de projet")||q.includes("project management")||q.includes("workflow")||q.includes("methode")||q.includes("organisation")){
    return {source:"local",text:"Sa méthode : clarifier le problème, rendre les responsabilités visibles, créer un rythme de décision, puis livrer. Il ne s’agit pas juste de suivre des tâches : il s’agit de rendre le projet pilotable."};
  }
  if(q.includes("branding")||q.includes("marque")||q.includes("identite")||q.includes("direction creative")){
    return {source:"local",text:"En branding, son approche est utile avant d’être décorative : cohérence, reconnaissance, usage réel sur les supports, et une direction qui sert le positionnement."};
  }
  if(q.includes("faiblesse")||q.includes("limite")||q.includes("risque")){
    return {source:"local",text:"Lecture honnête : son profil est hybride, donc il faut lui donner des sujets où cette transversalité est utile. Sur un poste ultra-spécialisé et isolé, ce serait moins pertinent que sur un rôle qui demande coordination, produit et sens du design."};
  }
  return {source:"llm",text:"Je n’ai pas de réponse locale précise."};
}

function nextSuggestions(question){
  const q=normalizeQuestion(question);
  if(q.includes("recruter")||q.includes("pitch")||q.includes("profil"))return ["Quel projet prouve son niveau ?","Ses compétences clés ?","Ses limites ?"];
  if(q.includes("projet")||q.includes("jdis")||q.includes("ux"))return ["Pourquoi JDIS est fort ?","Son approche UX ?","Comment le contacter ?"];
  if(q.includes("contact")||q.includes("disponible"))return ["Pitch en 20 secondes","Pourquoi le recruter ?","Ses outils ?"];
  return defaultSuggestions;
}

function renderSuggestions(items=defaultSuggestions){
  const container=document.querySelector(".chat-suggestions");
  container.innerHTML=items.map(item=>`<button type="button">${item}</button>`).join("");
  container.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>askChat(button.textContent)));
}

function addMessage(text,type="bot"){
  const message=document.createElement("p");
  message.className=type;
  if(type.includes("bot"))message.innerHTML=formatBotAnswer(text);
  else message.textContent=text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop=chatMessages.scrollHeight;
  return message;
}

function escapeHtml(text){
  return String(text).replace(/[&<>"']/g,character=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#039;"
  })[character]);
}

function inlineFormat(text){
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/`([^`]+)`/g,"<code>$1</code>");
}

function formatBotAnswer(text){
  const normalized=String(text||"").replace(/\r\n/g,"\n").trim();
  if(!normalized)return "";
  const lines=normalized.split("\n");
  const html=[];
  let list=[];
  const flushList=()=>{
    if(!list.length)return;
    html.push(`<ul>${list.map(item=>`<li>${inlineFormat(item)}</li>`).join("")}</ul>`);
    list=[];
  };
  for(const rawLine of lines){
    const line=rawLine.trim();
    if(!line) {
      flushList();
      continue;
    }
    const heading=line.match(/^#{1,4}\s+(.+)/);
    if(heading){
      flushList();
      html.push(`<strong class="chat-heading">${inlineFormat(heading[1])}</strong>`);
      continue;
    }
    const bullet=line.match(/^[-*•]\s+(.+)/);
    if(bullet){
      list.push(bullet[1]);
      continue;
    }
    flushList();
    html.push(`<span>${inlineFormat(line)}</span>`);
  }
  flushList();
  return html.join("");
}

function completePossiblyTruncatedAnswer(answer){
  const text=String(answer||"").trim();
  if(!text)return "Je n’ai pas réussi à formuler une réponse utile.";
  if(text.length<80||/[.!?…)]$/.test(text))return text;
  return `${text}\n\nJe complète pour éviter une réponse coupée : retiens surtout l’idée principale, puis applique-la étape par étape. Si tu veux, je peux aussi te refaire cette réponse en version courte, détaillée ou actionnable.`;
}

async function askLlm(question){
  if(!LLM_ENDPOINT){
    return "Je peux répondre avec un LLM dès qu’un endpoint sécurisé est branché. Pour l’instant, je reste en mode FAQ locale pour éviter d’exposer une clé API dans le site.";
  }
  const response=await fetch(LLM_ENDPOINT,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      message:question,
      history:chatHistory.slice(-8)
    })
  });
  if(!response.ok)throw new Error("LLM request failed");
  const data=await response.json();
  return completePossiblyTruncatedAnswer(data.answer);
}

async function askChat(question){
  addMessage(question,"user");
  const answer=answerQuestion(question);
  if(answer.source==="local"){
    chatHistory.push({role:"user",content:question},{role:"assistant",content:answer.text});
    setTimeout(()=>{
      addMessage(answer.text,"bot");
      renderSuggestions(nextSuggestions(question));
    },180);
    return;
  }
  const typing=addMessage("Je réfléchis…","bot thinking");
  try{
    const llmAnswer=await askLlm(question);
    typing.className="bot";
    typing.innerHTML=formatBotAnswer(llmAnswer);
    chatHistory.push({role:"user",content:question},{role:"assistant",content:llmAnswer});
    renderSuggestions(nextSuggestions(question));
  }catch(error){
    typing.className="bot";
    typing.innerHTML=formatBotAnswer("Le LLM ne répond pas pour le moment. Je reste utile en local : demande-moi son pitch, pourquoi le recruter, ses projets forts ou ses coordonnées.");
    renderSuggestions(["Pitch en 20 secondes","Pourquoi le recruter ?","Comment le contacter ?"]);
  }
  if(chatHistory.length>10)chatHistory.splice(0,chatHistory.length-10);
}

chatToggle.addEventListener("click",()=>{
  const opening=!miniChat.classList.contains("open");
  miniChat.classList.toggle("open",opening);
  chatToggle.setAttribute("aria-expanded",String(opening));
  chatPanel.setAttribute("aria-hidden",String(!opening));
  if(opening)setTimeout(()=>chatInput.focus(),120);
});

chatClose.addEventListener("click",()=>{
  miniChat.classList.remove("open");
  chatToggle.setAttribute("aria-expanded","false");
  chatPanel.setAttribute("aria-hidden","true");
  chatToggle.focus();
});

chatForm.addEventListener("submit",event=>{
  event.preventDefault();
  const question=chatInput.value.trim();
  if(!question)return;
  chatInput.value="";
  askChat(question);
});

renderSuggestions();
