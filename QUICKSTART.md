# Quick Start Guide

Get your portfolio running in minutes!

## Prerequisites

- Node.js 16+ installed
- pnpm installed (`npm install -g pnpm`)

## Setup (2 minutes)

1. **Install dependencies**
```bash
pnpm install
```

2. **Start dev server**
```bash
pnpm dev
```

3. **Open in browser**
```
http://localhost:5173
```

## Customize Your Portfolio (10 minutes)

### 1. Update Your Name & Title
**File:** `src/components/sections/Hero.jsx`

```javascript
// Change these lines:
<span className={styles.name}>John Doe</span>  // Your name
{displayText}  // Currently shows "Full Stack Developer & Designer"
```

### 2. Update About Section
**File:** `src/components/sections/About.jsx`

Replace the placeholder bio text with your actual experience and background.

### 3. Add Your Skills
**File:** `src/components/sections/Skills.jsx`

Update the `skillsData` object with your skills and proficiency levels:

```javascript
const skillsData = {
  frontend: [
    { name: 'React', level: 95 },
    { name: 'JavaScript', level: 95 },
    // Add your skills here
  ],
  backend: [
    // Backend skills
  ],
  tools: [
    // Tools and software
  ],
};
```

### 4. Add Your Experience
**File:** `src/components/sections/Experience.jsx`

Update the `experiences` array with your work history:

```javascript
const experiences = [
  {
    role: 'Your Job Title',
    company: 'Company Name',
    duration: 'Start Date - End Date',
    description: 'What you did',
    achievements: ['Achievement 1', 'Achievement 2'],
  },
  // Add more experiences
];
```

### 5. Showcase Your Projects
**File:** `src/components/sections/Projects.jsx`

Replace project data with your own:

```javascript
const projects = [
  {
    title: 'Project Name',
    description: 'Project description',
    image: 'https://your-image-url.com/image.jpg',
    tags: ['React', 'Node.js', 'etc'],
    liveUrl: 'https://project-url.com',
    githubUrl: 'https://github.com/username/repo',
  },
  // Add more projects
];
```

### 6. Update Contact Information
**File:** `src/components/sections/Contact.jsx`

Update email and contact info in the `contactInfo` array.

### 7. Add Social Links
**File:** `src/components/common/Footer.jsx`

Update the `socialLinks` array with your actual social media profiles:

```javascript
const socialLinks = [
  {
    icon: FiGithub,
    url: 'https://github.com/your-username',
    label: 'GitHub',
  },
  // Add more social links
];
```

### 8. Customize Colors
**File:** `src/index.css`

Update the CSS variables in `:root` to match your brand:

```css
:root {
  --primary: #3b82f6;        /* Main brand color */
  --secondary: #8b5cf6;      /* Secondary accent */
  --accent: #ec4899;         /* Highlight color */
  /* ... other colors ... */
}
```

### 9. Add Your Resume
Place your resume PDF in `/public/resume.pdf` and update the link in:
- `src/components/sections/Resume.jsx`

### 10. Update Metadata
**File:** `index.html`

Update the page title and metadata:

```html
<title>Your Name - Your Title</title>
<meta name="description" content="Your professional summary" />
<meta property="og:title" content="Your Name - Your Title" />
```

## Test Your Changes

The dev server has hot reload enabled, so changes will appear instantly!

## Build for Production

When ready to deploy:

```bash
pnpm build
```

This creates an optimized `dist/` folder ready for deployment.

## Deploy

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: Other Platforms
Upload the `dist/` folder to any static hosting:
- GitHub Pages
- Netlify
- Firebase Hosting
- AWS S3
- Any static host

## Troubleshooting

**Dev server won't start?**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

**Changes not appearing?**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Ensure dev server is running

**Build failing?**
- Check for TypeScript/ESLint errors
- Ensure all image URLs are valid
- Check console for detailed error messages

## Tips & Tricks

- **Add smooth sections:** Use `whileInView` animations for reveal effects
- **Custom fonts:** Import from `src/index.css` and use Tailwind classes
- **Dark mode:** Already included! Toggle in navbar
- **Mobile testing:** Use DevTools device emulation

## Need Help?

- Check `README.md` for detailed documentation
- Review component files for implementation examples
- React Router docs: https://reactrouter.com
- Framer Motion docs: https://www.framer.com/motion
- Vite docs: https://vitejs.dev

Happy building!
