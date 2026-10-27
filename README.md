# EcoAnouar — site portfolio

Site statique HTML / CSS / JavaScript (sans framework, sans build).
Icônes : Font Awesome 6 (CDN cdnjs) — connexion internet requise pour les afficher. Liste : https://fontawesome.com/icons

## Lancer
- Ouvrir `index.html` dans le navigateur, ou
- `python3 -m http.server 8000` puis http://localhost:8000

## Structure
```
index.html   structure et contenus
style.css    identité visuelle, responsive, animations
script.js    menu mobile, formulaire, WhatsApp, liens, animations
assets/      logo, favicon (+ photo et miniatures à ajouter)
```

## À compléter
| Élément | Où |
|---|---|
| Photo d'Anowar | `index.html` → bloc `photo-placeholder` (remplacer par `<img src="assets/anowar.webp">`) |
| Matières / semestres | `index.html` → cartes `.subject-card` (les cases du formulaire se mettent à jour automatiquement) |
| « Ma façon d'enseigner » | `index.html` → section `.method` |
| Lieu, format, durée, tarifs | `index.html` → cartes `.format-card` |
| Miniatures / vidéos | `index.html` → `.video-card__media` (image ou embed Instagram/TikTok) |
| Témoignages | `index.html` → remplacer les `.testimonial--placeholder` (modèle en commentaire) |

Les textes provisoires sont signalés par une icône crayon ou entre `[crochets]` — penser à retirer les badges `.placeholder-note` une fois le contenu final ajouté.

Contacts configurés dans `script.js` → `CONFIG` (WhatsApp, Instagram, TikTok, email).
