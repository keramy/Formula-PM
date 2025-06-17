// Formula International Branding Components
// Comprehensive logo system with multiple variants and use cases

// Main logo component
export { default as FormulaLogo } from './FormulaLogo';

// Logo variations
export {
  FormulaLogoCompact,
  FormulaLogoBranded,
  FormulaLogoAnimated,
  FormulaLogoWithTagline,
  FormulaLogoMinimal,
  FormulaLogoLoading,
} from './LogoVariations';

// Examples and documentation
export { default as LogoExamples } from './LogoExamples';

// Component usage guide:
// 
// FormulaLogo - Main logo component with full customization
// Usage: <FormulaLogo size="large" variant="horizontal" darkMode={false} />
//
// FormulaLogoCompact - Compact "F" logo for sidebar/mobile
// Usage: <FormulaLogoCompact darkMode={false} onClick={handleClick} />
//
// FormulaLogoBranded - Logo with background variants
// Usage: <FormulaLogoBranded variant="navy" size="medium" />
//
// FormulaLogoAnimated - Animated logo for loading screens
// Usage: <FormulaLogoAnimated size="large" showPulse={true} />
//
// FormulaLogoWithTagline - Logo with custom tagline
// Usage: <FormulaLogoWithTagline tagline="Your Custom Text" />
//
// FormulaLogoMinimal - Logo without "INTERNATIONAL" subtext
// Usage: <FormulaLogoMinimal size="small" />
//
// FormulaLogoLoading - Logo with loading animation
// Usage: <FormulaLogoLoading loadingText="Initializing..." />

// Brand colors reference:
// Navy: #1B2951
// Medium Navy: #566BA3
// Light Cream: #F5F2E8
// Dark Cream: #E8E2D5
// Background Cream: #FDFCFA
// Border Gray: #D1D8E6