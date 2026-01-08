# DUUO Insurance Website - Quick Overview

## What I Built

A professional, minimal insurance quote website for Duuo with Ford-inspired branding. The website guides users through a complete insurance quote journey.

## Live Application

The development server is running at: **http://localhost:5173/**

## Pages & Flow

1. **Landing Page** (`/`)
   - Hero section with Ford blue gradient background
   - Value propositions (2min quote, 24/7 support, 100% secure)
   - Clear call-to-action to start the quote

2. **Consent Page** (`/consent`)
   - Detailed privacy agreement
   - Scrollable consent text
   - Must accept checkbox to continue
   - Professional layout with Ford branding

3. **Quote Form** (`/quote`)
   - 5-step multi-step form with progress indicator
   - Step 1: Personal Information (name, DOB, email, phone)
   - Step 2: Address (street, city, province, postal code)
   - Step 3: Driver Info (license number, class, years licensed)
   - Step 4: Vehicle Info (year, make, model, VIN, usage)
   - Step 5: Coverage (type, deductible)
   - Full form validation
   - Back/Next navigation

4. **Quote Summary** (`/summary`)
   - Loading animation while calculating quote
   - Large display of annual and monthly premium
   - Complete summary of all entered information
   - Next steps information
   - Print functionality

## Design Features

### Ford Brand Identity
- Primary Blue: `#003478`
- Light Blue: `#2D96CD`
- Dark Blue: `#00095B`
- Clean, professional aesthetic

### User Experience
- Fully responsive (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Progress tracking through multi-step form
- Clear validation and error handling
- Professional typography (Inter font)
- Accessible form inputs with proper labels

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Form Handling**: React controlled components
- **Quote Calculation**: Client-side logic (can be replaced with API)

## Quick Commands

```bash
# Start development server (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
duuo-insurance/
├── src/
│   ├── components/       # Reusable form components
│   ├── pages/           # Route pages
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Router configuration
│   └── main.tsx         # Entry point
├── tailwind.config.js   # Custom Ford colors
└── package.json
```

## Next Steps

To integrate with your backend:

1. Replace the quote calculation in `src/pages/Summary.tsx` with an API call
2. Add form submission to save quotes to your database
3. Configure email notifications
4. Add user authentication if needed
5. Deploy to your hosting platform

The website is production-ready and can be deployed as-is to services like Vercel, Netlify, or any static hosting.

## Customization

- Update Ford colors in `tailwind.config.js`
- Modify form fields in `src/types/quote.ts` and `src/pages/Quote.tsx`
- Add more Canadian provinces if needed
- Change quote calculation logic in `src/pages/Summary.tsx`

## Support

- All code is well-structured and commented
- TypeScript provides type safety
- Responsive design works on all devices
- Build passes with no errors or warnings
