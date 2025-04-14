import type { Config } from "tailwindcss";

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

// Performance optimized Tailwind config
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts}",
    "./hooks/**/*.{js,ts}",
    "./config/**/*.{js,ts}",
  ],
  // Safelist - add critical classes that must not be purged here
  safelist: [
    // Critical UI classes that might be conditionally applied
    'bg-[#1D1D1D]',
    'text-[#dfff1f]',
    'text-white',
    'text-gray-400',
    // Animations that might be dynamically applied
    'animate-pulse',
    'animate-draw',
    'animate-shiny-text',
  ],
  future: {
    hoverOnlyWhenSupported: true, // Dokunmatik cihazlarda hover efektlerini önleme
    respectDefaultRingColorOpacity: true, // Focus ringleri için daha iyi renk kontrolü
    disableColorOpacityUtilitiesByDefault: true, // Renk opaklığı yardımcı programlarını devre dışı bırakma
  },
  // Performance & Bundle Size Optimization
  corePlugins: {
    // Az kullanılan özellikler kaldırıldı - gerçekten ihtiyaç duyduklarınızı ekleyin
    backdropBlur: false,  
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    scrollSnapType: false,
    scrollSnapAlign: false,
    scrollSnapStop: false,
    touchAction: false,
    willChange: false,
  },
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Add font variables
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        'yellow-50': '#fefce8', // Eğer bu renk yoksa ekleyin.
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Accessibility friendly color variations
        accessible: {
          yellow: {
            DEFAULT: '#dfff1f',
            light: '#e5ff4f', 
            dark: '#c5e500',
            contrast: '#000000', // Yüksek kontrast
          },
          gray: {
            DEFAULT: '#1D1D1D',
            light: '#2d2d2d',
            dark: '#111111',
            contrast: '#ffffff', // Yüksek kontrast
          }
        }
      },
      keyframes: {
        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - var(--gap)))",
          },
        },
        "marquee-vertical": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(calc(-100% - var(--gap)))",
          },
        },
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' }
        },
        'draw': {
          '0%': { 'stroke-dasharray': '60', 'stroke-dashoffset': '60' },
          '100%': { 'stroke-dasharray': '60', 'stroke-dashoffset': '0' }
        },
        'drawBorder': {
          '0%': { 'stroke-dashoffset': '1040' },
          '100%': { 'stroke-dashoffset': '0' }
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fadeOut': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'slideIn': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slideOut': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      },
      animation: {
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "shiny-text": "shiny-text 8s infinite",
        'scale-in': 'scale-in 0.2s ease-in-out',
        'draw': 'draw 0.3s ease-in-out forwards',
        'drawBorder': 'drawBorder 2s ease-in-out forwards',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'fadeOut': 'fadeOut 0.3s ease-in-out',
        'slideIn': 'slideIn 0.4s ease-in-out',
        'slideOut': 'slideOut 0.4s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      gridTemplateColumns: {
        "14": "repeat(14, minmax(0, 1fr))",
      },
      clipPath: {
        'house': 'polygon(0% 75%, 50% 0%, 100% 75%, 100% 100%)',
      },
      // For improved accessibility
      spacing: {
        'focus-ring': '2px',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      boxShadow: {
        'focus-visible': '0 0 0 2px var(--accessible-yellow-DEFAULT, #dfff1f)',
      },
    },
  },

  plugins: [
    addVariablesForColors,
    require("tailwindcss-animate"),
    // require("tailwindcss-clip-path"),
    function({ addComponents, theme, addBase }: any) {
      // Add high contrast focus styles for better accessibility
      addComponents({
        '.focus-ring': {
          outline: 'none',
          position: 'relative',
          '&:focus-visible': {
            '&::after': {
              content: '""',
              position: 'absolute',
              top: `-${theme('spacing.focus-ring')}`,
              right: `-${theme('spacing.focus-ring')}`,
              bottom: `-${theme('spacing.focus-ring')}`,
              left: `-${theme('spacing.focus-ring')}`,
              borderRadius: 'inherit',
              boxShadow: theme('boxShadow.focus-visible'),
              pointerEvents: 'none',
            }
          }
        },
        // Reduce motion preferences
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
        // Critical styles that should be loaded first 
        '.critical': {
          display: 'block',
          width: '100%',
          height: 'auto',
          maxHeight: theme('spacing.screen'),
          objectFit: 'contain',
        },
        // Optimized loading classes
        '.lazy-load': {
          opacity: '0',
          transition: 'opacity 0.3s ease-in-out',
        },
        '.lazy-loaded': {
          opacity: '1',
        },
        // Screen reader utilities enhanced
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
      });

      // Add global base styles for performance optimizations
      addBase({
        'html': {
          scrollBehavior: 'smooth',
          textRendering: 'optimizeSpeed',
          'WebkitFontSmoothing': 'antialiased',
          'MozOsxFontSmoothing': 'grayscale',
        },
        'img, picture, video, canvas, svg': {
          display: 'block',
          maxWidth: '100%',
        },
        'img, video': {
          height: 'auto',
          // Optimize CLS by reserving space
          '&:not([width]):not([height])': {
            aspectRatio: '16 / 9',
          }
        },
        // Preload hidden optimization
        'body:not(.fonts-loaded) .opt-text': {
          opacity: '0',
          visibility: 'hidden',
        },
        'body.fonts-loaded .opt-text': {
          opacity: '1',
          visibility: 'visible',
          transition: 'opacity 0.2s ease-in-out',
        },
        // Input optimizations
        'input, button, textarea, select': {
          font: 'inherit',
        },
      });
    }
  ],
};

export default config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": {
      ...newVars,
      "--radius": "0.5rem",
      "--shimmer-width": "50%",
      // Performans için CSS değişkenleri
      "--transition-standard": "0.3s ease-in-out",
      "--shadow-elevation-low": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      "--shadow-elevation-medium": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "--shadow-elevation-high": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  });
}
