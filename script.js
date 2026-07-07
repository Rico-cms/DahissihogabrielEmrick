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

  document.querySelectorAll(".pill,.hero-aside a,.contact-links a,.credential-controls button,.project-more button").forEach(element=>{
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
