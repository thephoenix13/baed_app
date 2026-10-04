# Waitlist Page - Bae'd

## Overview
A minimalist waitlist page for Bae'd that allows early adopters to sign up before the full app launch. This page is designed to be shared independently and positioned as the primary landing page for marketing efforts.

## Features

### Design
- **Minimalist aesthetic** aligned with Bae'd's design system
- **Clean, focused layout** with clear value proposition
- **Mobile-first responsive design** optimized for sharing
- **Consistent branding** using the established color palette and typography

### Functionality
- **Email collection form** with validation
- **Success state** after submission
- **Feature highlights** showcasing key benefits:
  - ID-verified profiles
  - Selfie match verification
  - Safe, respectful community
- **Error handling** for invalid email inputs
- **Smooth transitions** between form and success states

### User Experience
- **Clear call-to-action** with "Join Waitlist" button
- **Trust signals** through feature list and privacy assurance
- **No spam promise** to build user confidence
- **Option to submit another email** after successful signup

## Technical Implementation

### Files Created/Modified
1. **`src/app/screens/WaitlistScreen.tsx`** - New waitlist page component
2. **`src/App.tsx`** - Added routing for waitlist screen
3. **`src/app/screens/WelcomeScreen.tsx`** - Added link to waitlist page

### Component Structure
```
WaitlistScreen
├── Header (Logo + Tagline)
├── Value Proposition
│   ├── Title: "Join the waitlist"
│   ├── Description
│   └── Features List (3 items)
├── Email Form
│   ├── Input field with validation
│   ├── Error messages
│   └── Submit button
└── Success State
    ├── Success icon
    ├── Confirmation message
    └── "Join another email" option
```

### State Management
- `email` - Stores user's email input
- `submitted` - Tracks form submission status
- `error` - Stores validation error messages

### Validation
- Email format validation using regex
- Required field validation
- Real-time error feedback

## How to Access

### From Welcome Screen
1. Launch the app
2. On the welcome screen, click "Join Waitlist" button
3. You'll be taken to the waitlist page

### Direct Access
To make the waitlist page the default landing page, modify `src/App.tsx`:
```typescript
const [screen, setScreen] = useState<Screen>('waitlist'); // Changed from 'splash'
```

## Customization Options

### Update Form Submission
Replace the console.log in `handleSubmit` with your actual API endpoint:
```typescript
// TODO: Replace with actual API call
const response = await fetch('/api/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

### Modify Features List
Update the three feature items in the component:
```typescript
<div className="flex items-start gap-3">
  <div className="w-5 h-5 rounded-full bg-[var(--color-success-light)] ...">
    <svg>...</svg>
  </div>
  <p className="text-body">Your feature text here</p>
</div>
```

### Adjust Branding
- Logo: Update the SVG in the header section
- Tagline: Modify the text below "Bae'd"
- Colors: All colors use CSS variables from the design system

## Design System Compliance

### Colors Used
- `var(--color-bg)` - Background
- `var(--color-text)` - Primary text
- `var(--color-text-secondary)` - Secondary text
- `var(--color-accent)` - Accent color (logo)
- `var(--color-success)` - Success indicators
- `var(--color-success-light)` - Success backgrounds
- `var(--color-error)` - Error messages

### Typography
- `text-screen-title` - Main heading
- `text-section-title` - Section headings
- `text-body` - Body text
- `text-body-secondary` - Secondary text
- `text-caption` - Small text
- `text-small` - Footer text

### Components
- `btn btn-primary` - Primary CTA button
- `btn btn-secondary` - Secondary button
- `input` - Email input field
- Reusable icons from the design system

## Marketing Integration

### Shareable URL
Once deployed, the waitlist page can be shared via:
- `https://yourdomain.com/?screen=waitlist` (if using URL parameters)
- Direct link to the waitlist route

### Social Media Ready
- Clean, minimal design looks great in screenshots
- Clear value proposition for social posts
- Mobile-optimized for mobile-first marketing

### Email Campaign
- Use the waitlist page as the landing page for email campaigns
- Track signups through your backend API
- Segment users by signup date for launch prioritization

## Next Steps

1. **Backend Integration**
   - Create API endpoint to store waitlist emails
   - Set up email confirmation system
   - Implement analytics tracking

2. **Launch Preparation**
   - Set up email notification system for launch
   - Create referral system (optional)
   - Implement waitlist position tracking

3. **Marketing**
   - Create social media assets featuring the waitlist page
   - Set up landing page analytics
   - Prepare email campaign sequence

4. **Deployment**
   - Deploy to production environment
   - Set up custom domain (if needed)
   - Configure SSL certificate

## Analytics Tracking

Add tracking to measure waitlist performance:
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // ... validation ...
  
  // Track signup
  analytics.track('waitlist_signup', { email });
  
  // ... rest of submission logic ...
};
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper form labels
- ✅ Error messages linked to inputs
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast meets WCAG AA standards

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Status:** ✅ Complete and ready for deployment
**Build:** Successful (268.80 kB JS, 46.18 kB CSS)
**Dependencies:** None (uses existing design system)
