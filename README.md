# Rajni Pawar - Personal Website

A modern, responsive personal website showcasing my academic background, research experience, and professional achievements.

## Features

- Tile-based hero with photo, current roles, contact links, bio, and latest work
- Light / dark mode (follows system preference, with a manual toggle)
- Project cards with animated SVG illustrations and a detail popup; swipe slider on phones
- Publications grouped by year with search, type filters, and one-click BibTeX
- Experience organized by year, linked to the matching projects
- Responsive from desktop down to phone widths

## Sections

- **About**: Photo, current roles, contact links, bio, and latest work
- **Projects**: One card per research project, each linked to its publications
- **Publications**: Papers and posters (source: https://grc.iit.edu/gnosis/publications)
- **Experience**: Research and industry roles, education, certifications, and skills

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Font Awesome icons, Google Fonts (Inter, Space Grotesk, JetBrains Mono)

## Local Development

To run this website locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/rajnipawar/professional-website.git
   ```

2. Navigate to the project directory:
   ```bash
   cd professional-website
   ```

3. Open `index.html` in your web browser, or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

4. Visit `http://localhost:8000` in your browser

## Deployment to GitHub Pages

This website is deployed at: [https://rajnipawar.github.io/professional-website/](https://rajnipawar.github.io/professional-website/)

## Updating Your Website

After making changes to your website:

```bash
git add .
git commit -m "Update website content"
git push origin main
```

Changes will be reflected on your live site within a few minutes.

## Customization

### Updating Content

- **Personal Information**: Edit the content directly in `index.html`
- **Resume PDF**: Replace `docs/Rajni_2026.pdf`
- **Publications**: Copy an existing `<article class="pub">` block in `index.html`; set `data-type` to `conference`, `poster`, or `review`
- **Projects**: Copy a `<article class="proj-card">` block; the popup content lives in its `<template class="proj-detail">`
- **Colors**: Modify CSS variables in `style.css` under `:root` (dark-mode values live in the two dark blocks below it)
- **Fonts**: Change font family in the `body` CSS rule in `style.css`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- Email: rajnippawar20@gmail.com
- LinkedIn: [linkedin.com/in/raznaee](https://linkedin.com/in/raznaee)
- GitHub: [github.com/rajnipawar](https://github.com/rajnipawar)

---

Built with care by Rajni Pawar
