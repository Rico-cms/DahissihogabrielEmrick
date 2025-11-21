Documentation Complète du Portfolio Gabriel Emrick

       Table des Matières
1. [Structure HTML](   structure-html)
2. [Variables CSS](   variables-css)
3. [Animations et Effets](   animations-effets)
4. [JavaScript Interactif](   javascript-interactif)

Structure HTML

Head - Configuration de Base

 html
<meta charset="UTF-8">
 
**Rôle** : Définit l'encodage en UTF-8 pour supporter tous les caractères (accents, émojis, etc.)

 html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
 
**Rôle** : Rend le site responsive (adapté aux mobiles). `width=device-width` = la largeur s'adapte à l'écran, `initial-scale=1.0` = zoom initial à 100%

Polices et Icônes

 html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 
**Rôle** : `preconnect` établit une connexion anticipée aux serveurs Google Fonts pour accélérer le chargement des polices

 html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
 
**Rôle** : Charge 2 polices :
- **Inter** : Police moderne pour le texte courant (4 graisses : 300, 400, 500, 600)
- **Space Grotesk** : Police géométrique pour les titres (3 graisses : 300, 500, 700)
- `display=swap` : Affiche d'abord une police système puis charge la Google Font (évite le texte invisible)

 html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
 
**Rôle** : Charge Font Awesome pour les icônes (LinkedIn, email, téléphone, etc.)

  
Variables CSS

Thème de Couleurs

 css
:root {
    --bg-color:    050505;        /* Noir profond pour le fond */
    --text-main:    ffffff;       /* Blanc pur pour le texte */
    --text-muted:    9ca3af;      /* Gris pour les textes secondaires */
    --accent:    d4af37;          /* Or pour les éléments clés */
    --accent-dim: rgba(212, 175, 55, 0.15); /* Or transparent pour les effets */
}
 
**Rôle** : Variables CSS réutilisables partout dans le code avec `var(--nom-variable)`. Facilite les changements de thème.

  

Reset & Base CSS

Reset Universel

 css
* { margin: 0; padding: 0; box-sizing: border-box; }
 
**Rôle** : 
- `*` = sélectionne tous les éléments
- `margin: 0; padding: 0;` = supprime les marges par défaut des navigateurs
- `box-sizing: border-box;` = la largeur inclut padding et border (facilite le calcul des dimensions)

Scroll Behavior

 css
html {
    scroll-behavior: smooth;
}
 
**Rôle** : Active le défilement fluide lors des clics sur les liens d'ancrage (   about,    contact, etc.)

 css
scrollbar-width: thin;
scrollbar-color: var(--accent-dim) var(--bg-color);
 
**Rôle** : Personnalise la barre de défilement (Firefox) :
- `thin` = barre fine
- Couleur de la barre = or transparent sur fond noir

 css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-color); }
::-webkit-scrollbar-thumb { background-color: var(--accent-dim); border-radius: 20px; }
 
**Rôle** : Personnalise la barre de défilement (Chrome, Safari, Edge) :
- Largeur de 8px
- Fond noir
- Curseur or arrondi

Body Styling

css
body {
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    line-height: 1.8;
    overflow-x: hidden;
}
 
**Rôle** :
- Fond noir, texte blanc
- Police Inter par défaut
- `line-height: 1.8` = espacement confortable entre les lignes (180% de la taille de police)
- `overflow-x: hidden` = empêche le défilement horizontal (évite les bugs d'affichage)

  

Effets de Fond

Container de Background

 css
.background-container {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
}
 
**Rôle** :
- `position: fixed` = reste fixe lors du scroll
- `100vw, 100vh` = couvre tout l'écran (viewport width/height)
- `z-index: -1` = placé derrière tout le contenu
- `pointer-events: none` = les clics traversent cet élément (n'interfère pas avec les interactions)

Orbes Animés

 css
.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.3;
    animation: float 30s infinite ease-in-out;
}
 
**Rôle** :
- `border-radius: 50%` = forme circulaire
- `blur(120px)` = flou intense pour créer un effet de lumière diffuse
- `opacity: 0.3` = semi-transparent
- Animation "float" de 30 secondes en boucle infinie

 css
.orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, var(--accent) 0%, transparent 60%);
    top: -15%; right: -10%;
}
 
**Rôle** :
- Orbe or de 500px
- `radial-gradient` = dégradé circulaire : or au centre → transparent à 60%
- Positionné en haut à droite (hors écran partiellement)

 css
@keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-30px, 30px) scale(0.95); }
}
 
**Rôle** : Animation de flottement :
- Début (0%) et fin (100%) : position normale
- Milieu (50%) : décalé de -30px horizontal, +30px vertical, réduit à 95%
- Crée un mouvement organique de va-et-vient

Overlay de Bruit

 css
.noise-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.03;
    background: url('data:image/svg+xml;base64,...');
}
 
**Rôle** :
- Couche de texture granuleuse (grain film)
- SVG encodé en base64 avec filtre `feTurbulence` (bruit fractal)
- `opacity: 0.03` = très subtil
- Donne un aspect analogique/premium

  

Curseur Personnalisé

 css
.cursor-outline {
    width: 30px; height: 30px;
    border: 1.5px solid rgba(212, 175, 55, 0.4);
    position: fixed;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 9999;
    pointer-events: none;
    transition: width 0.3s, height 0.3s, background-color 0.3s;
    mix-blend-mode: screen;
}
 
**Rôle** :
- Cercle or de 30px qui suit le curseur
- `position: fixed` = reste en place lors du scroll
- `transform: translate(-50%, -50%)` = centre le cercle sur le curseur
- `pointer-events: none` = ne bloque pas les clics
- `mix-blend-mode: screen` = mode de fusion qui rend le curseur lumineux sur fond sombre

 css
body.hovering .cursor-outline {
    width: 50px; height: 50px;
    background-color: rgba(212, 175, 55, 0.05);
    border-color: var(--accent);
}
 
**Rôle** : Quand on survole un élément interactif :
- Le curseur s'agrandit à 50px
- Fond or transparent apparaît
- Bordure devient plus visible

  

Layout & Navigation

Container

 css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}
 
**Rôle** :
- Limite la largeur du contenu à 1200px (lisibilité optimale)
- `margin: 0 auto` = centre horizontalement
- `padding: 0 2rem` = espacement intérieur de 32px (2rem = 2×16px)

Navigation

 css
nav {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    padding: 1.2rem 2rem;
    z-index: 100;
    backdrop-filter: blur(30px) saturate(120%);
    background: rgba(5, 5, 5, 0.6);
    border-bottom: 1px solid rgba(255,255,255,0.03);
}
 
**Rôle** :
- Barre de navigation fixe en haut
- `z-index: 100` = au-dessus du contenu
- `backdrop-filter: blur(30px)` = effet de verre flou (glassmorphism)
- `saturate(120%)` = augmente légèrement la saturation des couleurs derrière
- Fond noir semi-transparent (0.6)
- Bordure subtile en bas

Logo Animé

 css
.logo-text {
    font-family: 'Space Grotesk';
    font-weight: 700;
    letter-spacing: 1px;
    background: linear-gradient(90deg,    fff, var(--accent),    fff);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer 8s infinite linear;
}
 
**Rôle** :
- Texte avec dégradé animé blanc → or → blanc
- `background-size: 200%` = dégradé 2× plus large que le texte
- `color: transparent` + `background-clip: text` = le dégradé est visible uniquement sur le texte
- Animation "shimmer" = déplace le dégradé de gauche à droite

 css
@keyframes shimmer {
    to { background-position: 200% center; }
}
 
**Rôle** : Déplace le dégradé de 0% à 200%, créant un effet de brillance qui traverse le texte

  

Hero Section

Structure Isométrique (SVG)

 html
<svg class="iso-structure" viewBox="0 0 100 100">
    <path d="M50 50 L15 30 L15 70 L50 90 Z" class="iso-path face-left" />
    <path d="M50 50 L85 30 L85 70 L50 90 Z" class="iso-path face-right" />
    <path d="M50 50 L15 30 L50 10 L85 30 Z" class="iso-path face-top" />
    <path d="M50 50 L50 25 M50 50 L25 65 M50 50 L75 65" class="iso-path face-inner" />
</svg>
 
**Rôle** : Dessine une forme 3D isométrique (cube ouvert) avec 4 chemins SVG :
- `face-left` : face gauche du cube
- `face-right` : face droite
- `face-top` : face supérieure
- `face-inner` : lignes intérieures

 css
.iso-path {
    fill: rgba(212, 175, 55, 0);
    stroke: var(--accent);
    stroke-width: 1.5;
    stroke-dasharray: 300;
    stroke-dashoffset: 300;
    animation: iso-draw 4s cubic-bezier(0.4, 0, 0.2, 1) forwards infinite;
}
 
**Rôle** :
- Trait or (`stroke`) de 1.5px d'épaisseur
- `stroke-dasharray: 300` = crée un trait pointillé de 300px
- `stroke-dashoffset: 300` = décale le trait de 300px (invisible au départ)
- L'animation réduit progressivement l'offset pour "dessiner" le trait

 css
@keyframes iso-draw {
    0% { stroke-dashoffset: 300; fill: rgba(212, 175, 55, 0); }
    40% { stroke-dashoffset: 0; fill: rgba(212, 175, 55, 0); }
    60% { fill: rgba(212, 175, 55, 0.1); }
    80% { fill: rgba(212, 175, 55, 0.1); opacity: 1; }
    90% { opacity: 0; transform: translateY(-10px); }
    100% { stroke-dashoffset: 300; fill: rgba(212, 175, 55, 0); opacity: 0; }
}
 
**Rôle** : Animation complète en 4 secondes :
- 0-40% : Dessine le trait progressivement
- 40-60% : Remplit l'intérieur avec de l'or transparent
- 60-80% : Maintient le remplissage
- 80-90% : Disparaît en montant légèrement
- 90-100% : Réinitialise pour boucler

Eyebrow (Badge)

 css
.eyebrow {
    color: var(--accent);
    font-size: 0.85rem;
    letter-spacing: 3px;
    font-weight: 600;
    padding: 6px 16px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 50px;
    background: rgba(212, 175, 55, 0.05);
    text-transform: uppercase;
}
 
**Rôle** :
- Petit badge or au-dessus du titre principal
- `letter-spacing: 3px` = espacement entre les lettres pour un look élégant
- Bordure arrondie (pilule)
- Fond or très subtil

Titre Principal

 css
.hero h1 {
    font-size: clamp(3.5rem, 7vw, 6rem);
}
 
**Rôle** : Taille responsive avec `clamp()` :
- Minimum : 3.5rem (56px)
- Idéal : 7% de la largeur de la fenêtre
- Maximum : 6rem (96px)
- S'adapte automatiquement à toutes les tailles d'écran

Curseur Clignotant

 css
.cursor-blink {
    display: inline-block;
    width: 4px;
    height: 0.9em;
    background: var(--accent);
    margin-left: 4px;
    animation: blink 1s infinite;
}
 
**Rôle** :
- Barre verticale or de 4px
- `height: 0.9em` = hauteur relative à la taille du texte
- Animation de clignotement

 css
@keyframes blink {
    50% { opacity: 0; }
}
 
**Rôle** : Clignote en devenant invisible à 50% du cycle (effet machine à écrire)

  

Marquee Infini

 css
.marquee-content {
    display: flex;
    gap: 4rem;
    width: max-content;
    animation: scroll 40s linear infinite;
}
 
**Rôle** :
- `display: flex` = aligne les éléments horizontalement
- `gap: 4rem` = espacement de 64px entre chaque élément
- `width: max-content` = largeur adaptée au contenu (nécessaire pour l'animation)
- Animation de défilement linéaire de 40 secondes

 css
@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
 
**Rôle** : Déplace le contenu de 0% à -50% (les éléments sont dupliqués dans le HTML, donc l'illusion d'infini fonctionne)

  

Cards 3D avec Tilt

 css
.card {
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: transform 0.1s ease-out;
}
 
**Rôle** :
- `preserve-3d` = permet aux enfants d'hériter de la transformation 3D
- `perspective: 1000px` = définit la profondeur de la perspective 3D

          JavaScript du Tilt

 javascript
card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
});
 
**Rôle** :
1. `getBoundingClientRect()` = obtient la position et taille de la carte
2. Calcule la position du curseur relative à la carte
3. Calcule la distance du curseur par rapport au centre
4. Convertit cette distance en rotation :
   - Curseur en haut → rotation vers l'avant (rotateX négatif)
   - Curseur à droite → rotation vers la droite (rotateY positif)
5. `* -4` et `* 4` = intensité de la rotation (max ±4 degrés)
6. `scale3d(1.02, 1.02, 1.02)` = agrandit légèrement la carte au survol

  

Timeline

 css
.timeline {
    position: relative;
    border-left: 2px solid rgba(255,255,255,0.1);
    margin-left: 10px;
    padding-left: 2.5rem;
}
 
**Rôle** :
- Ligne verticale à gauche (2px, blanc transparent)
- Espace de 2.5rem pour placer les éléments

 css
.timeline-dot {
    position: absolute;
    left: -3.15rem;
    top: 5px;
    width: 18px;
    height: 18px;
    background: var(--bg-color);
    border: 2px solid var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}
 
**Rôle** :
- Point circulaire de 18px
- Positionné sur la ligne (-3.15rem = 50.4px à gauche)
- Bordure or avec effet de lueur (box-shadow)
- Fond noir pour créer un effet "trou"

  

JavaScript Interactif

          1. Scroll Reveal

 javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -100px 0px" });
 
**Rôle** :
- `IntersectionObserver` = API qui détecte quand un élément entre dans la fenêtre
- `threshold: 0.15` = déclenche quand 15% de l'élément est visible
- `rootMargin: "0px 0px -100px 0px"` = zone de détection réduite de 100px en bas (l'élément doit être plus haut dans l'écran)
- `classList.add('active')` = ajoute la classe qui déclenche l'animation CSS
- `unobserve()` = arrête d'observer cet élément (économise les ressources)

 javascript
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
 
**Rôle** : Applique l'observer à tous les éléments avec la classe `.reveal`

          2. Curseur Magnétique

 javascript
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
 
**Rôle** :
- Stocke la position du curseur réel dans `mouseX/mouseY`
- `clientX/Y` = coordonnées du curseur dans la fenêtre

 javascript
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
}
 
**Rôle** : **Effet d'inertie** (easing) :
- Calcule la différence entre la position réelle et la position du cercle
- Ajoute 20% de cette différence à chaque frame
- Résultat : le cercle "suit" le curseur avec un léger retard fluide
- `requestAnimationFrame()` = boucle à 60fps pour une animation smooth

          3. Compteur de Visiteurs

 javascript
let count = localStorage.getItem('emrick_portfolio_views');
if (!count) {
    count = 12400 + Math.floor(Math.random() * 500);
} else {
    count = parseInt(count) + Math.floor(Math.random() * 5) + 1;
}
localStorage.setItem('emrick_portfolio_views', count);
 
**Rôle** :
- `localStorage` = stockage persistant dans le navigateur
- Première visite : génère un nombre entre 12400 et 12900
- Visites suivantes : incrémente de 1 à 5 aléatoirement
- Simule un compteur global (en réalité local à ce navigateur)

 javascript
let startValue = count - 150;
const duration = 2000;
const stepTime = Math.abs(Math.floor(duration / (count - startValue)));

const timer = setInterval(() => {
    startValue += 1;
    counterElement.innerText = new Intl.NumberFormat('fr-FR').format(startValue);
    if (startValue >= count) {
        clearInterval(timer);
    }
}, stepTime);
 
**Rôle** : **Animation de compteur** :
- Démarre à `count - 150` pour créer un effet de montée
- Calcule le temps entre chaque incrément : `2000ms / 150 = 13.3ms`
- Incrémente de 1 toutes les 13.3ms
- `Intl.NumberFormat('fr-FR')` = formate avec espaces (ex: 12 456)
- `clearInterval()` = arrête l'animation quand on atteint le nombre final

          4. Typewriter Effect

 javascript
const roles = ["Chef de Projet Digital", "Expert Transformation", ...];
let roleIndex = 0, charIndex = 0, isDeleting = false;
 
**Rôle** : Variables d'état :
- `roles` = tableau des phrases à afficher
- `roleIndex` = index de la phrase actuelle
- `charIndex` = position du caractère actuel
- `isDeleting` = mode écriture (false) ou effacement (true)

 javascript
function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        textElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
 
**Rôle** :
- `substring(0, charIndex)` = extrait les X premiers caractères
- Mode écriture : ajoute 1 caractère, incrémente `charIndex`
- Mode effacement : retire 1 caractère, décrémente `charIndex`

 javascript
let speed = isDeleting ? 50 : 100;

if (!isDeleting && charIndex === currentRole.length) {
    speed = 2500;
    isDeleting = true;
} else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 800;
}

setTimeout(type, speed);
 
**Rôle** : **Gestion du timing** :
- Écriture : 100ms par caractère
- Effacement : 50ms par caractère (plus rapide)
- Fin d'écriture : pause de 2500ms avant d'effacer
- Fin d'effacement : pause de 800ms, passe à la phrase suivante
- `(roleIndex + 1) % roles.length` = boucle infinie (retour à 0 après le dernier)
- `setTimeout(type, speed)` = rappelle la fonction après X millisecondes

  

Optimisations Performance

Media Queries

 css
@media (max-width: 768px) {
    .cursor-outline { display: none; }
    .nav-links { display: none; }
}
 
**Rôle** : Sur mobile (< 768px) :
- Cache le curseur personnalisé (inutile sur tactile)
- Cache les liens de navigation (affichage simplifié)

          Will-Change

 css
.orb {
    will-change: transform;
}
 
**Rôle** : Indique au navigateur que cette propriété va être animée, permettant une optimisation GPU en avance

          RequestAnimationFrame

 javascript
requestAnimationFrame(animateCursor);
 
**Rôle** : Synchronise l'animation avec le taux de rafraîchissement de l'écran (60fps), plus performant que `setInterval`

  

       Résumé des Interactions Clés

| Interaction | Déclencheur | Effet |
|        -|        -|    -|
| **Scroll** | Page défile | Éléments apparaissent progressivement |
| **Survol carte** | Curseur sur `.card` | Rotation 3D suivant le curseur |
| **Survol lien** | Curseur sur `a` | Curseur s'agrandit, texte change de couleur |
| **Page chargée** | DOM ready | Typewriter démarre, compteur anime |
| **Clic ancre** | Clic sur nav | Scroll fluide vers la section |

  

Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Animations, gradients, 3D transforms
- **Vanilla JavaScript** : Pas de framework, code natif
- **APIs Web** :
  - IntersectionObserver (détection scroll)
  - localStorage (persistance)
  - requestAnimationFrame (animations)
- **Google Fonts** : Typographie
- **Font Awesome** : Iconographie
- **SVG** : Graphismes vectoriels animés

  
Points d'Amélioration Possibles

1. **Accessibilité** : Ajouter `aria-labels`, support clavier
2. **SEO** : Balises meta, données structurées
3. **Performance** : Lazy loading images, préchargement fonts
4. **Mobile** : Menu hamburger, gestures tactiles
5. **Analytics** : Vrai compteur avec backend

Cette documentation couvre tous les aspects techniques du portfolio. Chaque ligne a un objectif précis dans l'expérience utilisateur finale.
