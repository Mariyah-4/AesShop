# SOULSTACY STUDIO — Aesthetic Art Store

A responsive, editorial-style storefront for digital portraits, photography, wallpapers, and printable wall art. Built with HTML, CSS, and vanilla JavaScript so it can be hosted on GitHub Pages without a build step.

## Features

- Responsive editorial design with serif typography and a muted ivory, rose, mauve, and charcoal palette.
- Product catalogue in `products.js`, separate from interface code.
- Live search, category filtering, and sorting by price, newest, and popularity.
- Product detail modal with formats, resolution, aspect ratio, licensing notes, and related work.
- Demo shopping bag with quantity controls, remove actions, and automatic subtotal.
- Favourites/wishlist saved to browser `localStorage`.
- Newsletter and contact form validation with clear demo-only messaging.
- Keyboard Escape handling, accessible labels, responsive mobile navigation, reduced-motion support, and lazy-loaded catalogue imagery.

## Run locally

1. Download and extract this project.
2. Open `index.html` in a modern browser.

For a local development server, open a terminal in the project folder and run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

No npm install or build step is required.

## Publish with GitHub Pages

1. Create a GitHub repository, for example `soulstacy-studio`.
2. Upload `index.html`, `styles.css`, `app.js`, `products.js`, and `README.md` to the repository root.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for the Pages deployment and open the published URL.

This is a plain static site, so it does not need a Vite `base` setting. All local script and stylesheet paths are relative, so they work from a repository subpath on GitHub Pages.

## Customise the shop

- **Products:** edit `products.js`. Each product has an `id`, `title`, `category`, `price` (INR), `format`, `resolution`, `ratio`, `popularity`, `newest`, `tag`, `image`, and `description`.
- **Artwork:** replace the sample Unsplash image URLs with artwork you own or images whose licence permits your intended use. Keep descriptive `alt` text.
- **Currency:** change the `money()` function in `app.js` if your store will use another currency.
- **Brand/contact:** edit the placeholder support address, social links, footer text, and metadata in `index.html`.
- **Design:** update the CSS custom properties near the top of `styles.css`.

## Important production limitations

This repository is a **front-end demo**, not a production commerce backend.

- The bag and favourites are stored in the current browser's `localStorage`. They are not synced across devices and can be cleared by the user.
- The checkout button intentionally does not charge anyone. Connect a legitimate payment provider through a secure server or trusted commerce platform before accepting payments. Never put secret API keys in this static repository.
- The contact and newsletter forms validate input but do not send/store submissions. Connect a backend or form service before launch.
- A static GitHub Pages site cannot securely protect paid downloads or manage private orders. Use a backend or digital-delivery platform for purchase verification, protected download links, receipts, refunds, and order records.
- Prices and product files are demo content. Verify licensing, taxes, privacy terms, and consumer requirements before selling.

## Image and font notes

Sample artwork previews load from Unsplash image CDN URLs, and fonts load from Google Fonts. Internet access is required for those external assets. Replace them with original/licensed local assets if you need fully self-hosted deployment.
