# Maison interactive — portfolio de Gabriel Emrick

Prototype autonome Three.js inspiré de la direction visuelle du portfolio existant.

## Lancer localement

Depuis le dossier `portfolio-house` :

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

Three.js est chargé depuis jsDelivr avec une version verrouillée (`0.170.0`). Une connexion Internet est donc nécessaire lors de l'affichage. Pour une mise en production totalement autonome, remplacez les deux URL de l'import map par des copies locales des modules.

## Intégration dans le portfolio

Le prototype peut être intégré comme nouvelle expérience dédiée, ou adapté dans la section `hero-stage`. Les données éditoriales se trouvent dans `ROOM_DATA` au début de `app.js`.

## Structure

- `index.html` : interface, navigation et fallback accessible.
- `styles.css` : direction artistique et responsive.
- `app.js` : construction procédurale Three.js et interactions.
- `object-sculpt-spec.json` : contrat de reconstruction du skill.
- `reference-house.jpg` : image conceptuelle optimisée ayant servi de référence.
