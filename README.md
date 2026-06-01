# Modern Portfolio Website

A stunning, production-ready portfolio website built with React, Vite, Framer Motion, and React Router. Features smooth animations, dark/light theme toggle, responsive design, and multiple portfolio sections.

## Features

✨ **Modern Design**
- Beautiful gradient UI with glassmorphism effects
- Smooth animations powered by Framer Motion
- Dark/Light theme toggle with localStorage persistence
- Fully responsive mobile-first design

🚀 **Performance**
- Built with Vite for ultra-fast development and optimized builds
- Code splitting and lazy loading
- Production bundle < 150KB gzipped

📱 **Responsive**
- Mobile-first design approach
- Works perfectly on all screen sizes (mobile, tablet, desktop)
- Touch-friendly interactive elements

🎨 **Components**
- 8 portfolio sections (Hero, About, Skills, Experience, Projects, GitHub, Resume, Contact)
- Reusable component architecture
- CSS Modules for scoped styling
- Context API for theme management

⚡ **Features**
- Typewriter effect on hero section
- Smooth scroll navigation with active section highlighting
- Scroll progress bar
- Back to top button
- Contact form with validation
- GitHub projects showcase
- Skill category filtering
- Experience timeline
- Project portfolio with image overlays

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router 7
- **Animations**: Framer Motion 12
- **Icons**: React Icons 5.6
- **Styling**: CSS Modules + Tailwind CSS
- **Theme Management**: Context API
- **Package Manager**: pnpm

## Project Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollProgress.jsx
│   │   └── BackToTop.jsx
│   └── sections/            # Portfolio sections
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Skills.jsx
│       ├── Experience.jsx
│       ├── Projects.jsx
│       ├── GitHub.jsx
│       ├── Resume.jsx
│       └── Contact.jsx
├── context/
│   └── ThemeContext.jsx     # Theme management
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd portfolio-website
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start development server**
```bash
pnpm dev
```

The application will open at `http://localhost:5173`

## Available Scripts

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm start

# Run ESLint
pnpm lint
```

## Customization

### Update Your Information

Edit the following files to add your personal information:

- `src/components/sections/Hero.jsx` - Update name and title
- `src/components/sections/About.jsx` - Add your bio
- `src/components/sections/Skills.jsx` - Update your skills
- `src/components/sections/Experience.jsx` - Add your work experience
- `src/components/sections/Projects.jsx` - Showcase your projects
- `src/components/sections/Contact.jsx` - Update contact information
- `src/components/common/Footer.jsx` - Update social links and copyright

### Customize Theme Colors

Edit `src/index.css` and update the CSS variables in `:root`:

```css
:root {
  --primary: #3b82f6;           /* Main brand color */
  --secondary: #8b5cf6;         /* Secondary accent */
  --accent: #ec4899;            /* Accent color */
  --background: #0f172a;        /* Background */
  --surface: #1e293b;           /* Surface color */
  /* ... more variables ... */
}
```

### Add Your Resume

Replace `/public/resume.pdf` with your resume file.

### Update Social Links

Edit `src/components/common/Footer.jsx` and `src/components/sections/Contact.jsx` to update your social media links.

## Theme System

The application includes a built-in dark/light theme system that:

- Persists user preference in localStorage
- Updates all colors using CSS variables
- Supports smooth transitions between themes
- Includes light theme variant in `src/index.css`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Optimization

The portfolio is optimized for performance with:

- Vite's optimized build pipeline
- CSS Modules for scoped styling
- Lazy loading with React Router
- Image optimization
- Code splitting
- Production bundle size: ~125KB gzipped

## Accessibility

Features implemented for better accessibility:

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast compliance
- Mobile touch-friendly interactions

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel will automatically detect Vite and configure build settings
4. Deploy with zero configuration

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Deploy to Other Platforms

Since this is a static site, you can deploy to:

- GitHub Pages
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront
- Any static hosting provider

Just run `pnpm build` and upload the `dist/` folder.

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the maintainers.

---

Built with ❤️ using React, Vite, and Framer Motion
