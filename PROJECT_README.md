# DUUO Insurance Quote Website

A professional, minimal insurance quote website with Ford-inspired branding for Duuo's white-label insurance solutions.

## Features

- **Landing Page**: Professional introduction with Ford-inspired design (blue color palette)
- **Consent Page**: Comprehensive privacy agreement and consent collection
- **Multi-Step Quote Journey**: 5-step form collecting:
  1. Personal Information
  2. Address Details
  3. Driver Information
  4. Vehicle Information
  5. Coverage Options
- **Quote Summary**: Displays calculated insurance quote with full details

## Design Principles

- **Minimal & Professional**: Clean, uncluttered interface
- **Ford Brand Identity**: Uses Ford's signature blue tones (#003478, #2D96CD)
- **High-Value Feel**: Premium aesthetic with smooth transitions
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: Proper form validation and user feedback

## Tech Stack

- React 18 with TypeScript
- Vite (fast development and build)
- Tailwind CSS (utility-first styling)
- React Router (client-side routing)
- Inter font family (modern, professional typography)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

The project is already set up in the `duuo-insurance` directory. To run:

```bash
cd duuo-insurance
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
duuo-insurance/
├── src/
│   ├── components/          # Reusable components
│   │   ├── InputField.tsx   # Form input component
│   │   ├── SelectField.tsx  # Form select component
│   │   └── ProgressBar.tsx  # Multi-step progress indicator
│   ├── pages/               # Page components
│   │   ├── Landing.tsx      # Home/landing page
│   │   ├── Consent.tsx      # Privacy consent page
│   │   ├── Quote.tsx        # Multi-step quote form
│   │   └── Summary.tsx      # Quote results page
│   ├── types/               # TypeScript types
│   │   └── quote.ts         # Quote data interface
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles & Tailwind
├── tailwind.config.js      # Tailwind configuration
├── package.json
└── vite.config.ts
```

## Color Palette

The website uses Ford-inspired colors:

- **Primary Blue**: `#003478` (ford-blue)
- **Light Blue**: `#2D96CD` (ford-lightblue)
- **Dark Blue**: `#00095B` (ford-darkblue)
- **Gray**: `#6B7280` (ford-gray)
- **Light Gray**: `#F3F4F6` (ford-lightgray)

## Quote Journey Flow

1. User lands on homepage
2. Clicks "Start Your Quote"
3. Reads and accepts consent agreement
4. Completes 5-step quote form:
   - Personal info (name, DOB, email, phone)
   - Address (street, city, province, postal code)
   - Driver details (license number, class, years licensed)
   - Vehicle info (year, make, model, VIN, usage)
   - Coverage preferences (type, deductible)
5. Views calculated quote with summary
6. Can print quote or return home

## Customization

### Updating Brand Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  ford: {
    blue: '#003478',
    lightblue: '#2D96CD',
    // ... etc
  }
}
```

### Adding/Modifying Form Fields

Edit `src/types/quote.ts` to add new fields to the quote data structure, then update the relevant step in `src/pages/Quote.tsx`.

### Quote Calculation Logic

The quote calculation is done in `src/pages/Summary.tsx` in the `calculateX` functions. Update these to match your actual pricing logic.

## Future Enhancements

- Backend API integration for real quote calculation
- Email notifications
- PDF quote generation
- Save and resume functionality
- Multi-language support
- Additional vehicle types (motorcycle, RV, etc.)

## License

Proprietary - Duuo Insurance Solutions
