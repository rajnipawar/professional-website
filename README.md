# Rajni Pawar - Personal Website

A modern, responsive personal website showcasing my academic background, research experience, and professional achievements.

## Features

- Responsive design that works on desktop, tablet, and mobile devices
- Smooth scrolling navigation
- Interactive UI elements with animations
- Clean, professional layout
- Optimized for GitHub Pages hosting

## Sections

- **Home**: Hero section with introduction and quick links
- **About**: Brief professional summary
- **Education**: Academic background and achievements
- **Research**: Detailed research experience and projects
- **Work Experience**: Professional work history
- **Projects**: Notable projects and implementations
- **Publications**: Research publications and achievements
- **Skills**: Technical skills organized by category
- **Contact**: Contact information and social media links

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Font Awesome Icons

## Local Development

To run this website locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/rajnipawar/rajnipawar.github.io.git
   ```

2. Navigate to the project directory:
   ```bash
   cd rajnipawar.github.io
   ```

3. Open `index.html` in your web browser, or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

4. Visit `http://localhost:8000` in your browser

## Deployment to GitHub Pages

Follow these steps to deploy your website to GitHub Pages:

### Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Personal website"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the '+' icon in the top right and select 'New repository'
3. Name your repository `rajnipawar.github.io` (replace with your GitHub username)
4. Do NOT initialize with README, .gitignore, or license
5. Click 'Create repository'

### Step 3: Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/rajnipawar/rajnipawar.github.io.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on 'Settings' tab
3. Scroll down to 'Pages' in the left sidebar
4. Under 'Source', select 'main' branch
5. Click 'Save'

### Step 5: Access Your Website

Your website will be live at: `https://rajnipawar.github.io`

It may take a few minutes for the site to be published initially.

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
- **Resume PDF**: Replace `Rajni_Pawar_2025.pdf` with your own resume
- **Colors**: Modify CSS variables in `style.css` under `:root`
- **Fonts**: Change font family in the `body` CSS rule in `style.css`

### Color Scheme

The website uses CSS variables for easy color customization. Edit these in `style.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --text-light: #6b7280;
    /* ... more variables */
}
```

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
