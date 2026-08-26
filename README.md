<<<<<<< HEAD
# Aaron Santos Tulabut — Junior Web Developer Portfolio

## Folder structure

```text
aaron-portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    └── images/
        ├── profile.jpg                  # Add your profile photo here
        └── projects/
            ├── simon-dost3/
            │   ├── 01-dashboard.jpg     # Replace placeholder references
            │   ├── 02-assets.jpg
            │   └── 03-maintenance.jpg
            └── project-2/
                └── 01-cover.jpg
```

## Adding your real profile photo

Place your photo at:

`assets/images/profile.jpg`

Then replace the `.portrait-placeholder` element in `index.html` with:

```html
<img class="profile-photo" src="assets/images/profile.jpg" alt="Aaron Santos Tulabut">
```

Add the following CSS if you use the real image:

```css
.profile-photo {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 20px;
}
```

## Adding screenshots

1. Create a folder under `assets/images/projects/` for each project.
2. Put the screenshot files in that project folder.
3. Open `js/main.js`.
4. Find that project's `images` array.
5. Duplicate one image object to add another screenshot.
6. Change `src`, `caption`, and `alt`.
7. No gallery logic needs to be changed.

Example:

```js
images: [
  { src: 'assets/images/projects/simon-dost3/01-dashboard.jpg', caption: 'Dashboard', alt: 'SIMON-DOST3 dashboard screenshot' },
  { src: 'assets/images/projects/simon-dost3/02-assets.jpg', caption: 'Asset management', alt: 'SIMON-DOST3 asset management screen' },
  { src: 'assets/images/projects/simon-dost3/03-maintenance.jpg', caption: 'Maintenance workflow', alt: 'SIMON-DOST3 maintenance screen' }
]
```

## Adding more projects

Open `js/main.js` and duplicate one object inside `PROJECT_DATA`.

Give it:
- a unique `id`
- project `title`
- `subtitle`
- `year`
- short `description`
- real `features`
- real `stack`
- an `images` array

Create a matching image folder under `assets/images/projects/`.

The project grid, modal, technology badges, and screenshot gallery are generated automatically from `PROJECT_DATA`.

## Editing personal information

- Name/title: `index.html` hero section
- Email: `index.html` contact section
- GitHub: `index.html` contact and header links
- Summary/about copy: `index.html`
- Skills: `index.html` skills section
- Experience: `index.html` experience section
- Project content: `js/main.js`
=======
# aaron-tulabut-portfolio
>>>>>>> 85d47f94f58a52546cb9ee3ff075a3484ca8032c
