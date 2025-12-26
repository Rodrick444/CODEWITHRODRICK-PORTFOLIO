# Design Guidelines for CODEWITHKAYLA Portfolio

## Design Approach
**Reference-Based Strategy**: Modern, dynamic design with blue and white color scheme. Focus on bold typography, smooth animations, and vibrant blue accents that create energy and professionalism. Include persistent navigation bar for easy browsing.

## Typography System

**Font Stack** (via Google Fonts):
- **Display/Headings**: "Space Grotesk" - Bold (700), Semi-Bold (600)
- **Body/UI**: "Inter" - Regular (400), Medium (500)

**Type Scale**:
- Hero headline: text-6xl to text-7xl (desktop), text-4xl (mobile)
- Section headings: text-4xl to text-5xl (desktop), text-3xl (mobile)
- Project titles: text-2xl to text-3xl
- Body text: text-base to text-lg
- UI elements: text-sm to text-base

## Layout System

**Spacing Primitives**: Limit to Tailwind units 4, 6, 8, 12, 16, 20, 24, 32
- Common pattern: p-8 or p-12 for sections on mobile, p-16 or p-20 on desktop
- Element spacing: gap-6 or gap-8 for grids
- Vertical rhythm: py-24 or py-32 for major sections

**Container Strategy**:
- Hero/full-width sections: w-full with max-w-7xl inner container
- Content sections: max-w-6xl mx-auto px-6 lg:px-8
- Text-heavy content: max-w-3xl for optimal reading

## Component Design

### Hero Section
**Layout**: Full viewport height (min-h-screen), split asymmetrically
- Left side (60%): Large hero image with subtle parallax effect
- Right side (40%): Content overlay with gradient backdrop blur
- Mobile: Stack vertically, image as background with overlay

**Content Structure**:
- "CODEWITHKAYLA" in massive display font
- Tagline: "Web Developer & Designer" in lighter weight
- Brief intro line (max 15 words)
- Dual CTA buttons: Primary "View Projects" + Secondary "Get in Touch"
- Floating social proof: "50+ Projects Delivered" badge or similar metric
- Scroll indicator at bottom (animated arrow or text)

**Buttons on Hero Image**: Implement glassmorphism effect - backdrop-blur-md with semi-transparent background, no hover state changes (rely on inherent button styling)

### Portfolio/Projects Section
**Layout**: Masonry-style grid (not uniform)
- Desktop: 2-column asymmetric grid with varied heights
- Tablet: 2-column uniform
- Mobile: Single column

**Project Cards**:
- Large project image fills card (aspect-ratio-16/9 or aspect-ratio-4/3)
- On hover: Overlay slides up revealing title + description
- Overlay gradient from bottom with backdrop-blur-sm
- Title: text-2xl font-semibold
- Description: text-base, max 2 lines with truncation
- "View Project" link appears on hover

**Grid Spacing**: gap-6 on mobile, gap-8 on desktop

### About Me Section
**Layout**: Centered content with side flourishes
- Profile image (rounded, 300x300px) on left
- Bio text on right (max-w-2xl)
- Desktop: 2-column (40/60 split)
- Mobile: Stacked, centered

**Content Structure**:
- Section heading: "About Me"
- 2-3 short paragraphs of bio
- Skills/expertise tags below (pill-style badges)
- Secondary CTA: "Download Resume" (if applicable)

### Contact Section
**Layout**: 2-column split (desktop), stacked (mobile)
- Left (50%): Contact form
- Right (50%): Contact information + visual element

**Form Design**:
- Floating label inputs (labels animate up on focus)
- Fields: Name, Email, Message (textarea)
- Full-width text inputs with border-b-2 underline style
- Generous spacing: gap-6 between fields
- Submit button: Full-width, prominent
- Success/error states with smooth transitions

**Right Column**:
- Alternative contact methods
- Email address with icon
- Response time indicator ("I respond within 24 hours")
- Decorative element or abstract shape

## Animation Strategy

**Entrance Animations** (trigger on scroll):
- Fade-in + slide-up (y-offset: 20px) for all sections
- Stagger project cards (50ms delay between each)
- Hero text: Characters fade in sequentially

**Interaction Animations**:
- Project cards: scale(1.02) + shadow expansion on hover
- Buttons: Subtle scale(0.98) on active, smooth transition
- Form inputs: Border color transition on focus (200ms)
- Smooth scroll behavior for navigation

**Performance**: Keep animations to opacity, transform properties only; avoid width/height animations

## Component Library

**Icons**: Font Awesome (via CDN) - use regular weight, size-6 or size-8
- Social icons in header/footer
- Contact method icons
- Arrow indicators

**UI Elements**:
- Primary buttons: Large padding (px-8 py-4), rounded-lg
- Secondary buttons: Outline style with same padding
- Input fields: Minimalist with bottom border, rounded-none
- Cards: Overflow hidden, rounded-xl

## Images

**Hero Section**:
- Large hero image: Professional workspace or coding setup (1920x1080 minimum)
- Should convey creativity, professionalism, modern technology
- Image treatment: Slight desaturation or blue-tinted overlay for brand cohesion

**Portfolio Projects**:
- Each project requires 1 primary image (1200x800 minimum)
- Should be screenshots of actual work, mockups, or finished products
- Consistent aspect ratios across all projects

**About Me**:
- Professional headshot or portrait (500x500 minimum, square crop)
- Should be approachable, professional

**Placement Strategy**: Hero image takes 60% viewport, project images fill their cards, about image is constrained to 300x300px circle

## Critical Notes

- **No viewport locking**: Sections use natural height, only hero uses min-h-screen
- **Vertical rhythm**: Consistent py-24 between major sections
- **Multi-column**: Use strategically in portfolio grid and contact section only
- **Mobile-first**: All layouts stack gracefully on mobile
- **Admin panel design**: Simple, utilitarian - prioritize function over form (table-based project list, standard form inputs for uploads)