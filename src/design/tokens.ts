/**
 * Design tokens extracted from Figma frame 16:1204 (maggieAI).
 * Typography, colors, and spacing values map 1:1 to the design system.
 */

export const colors = {
  font: {
    100: '#f4eef2',
    200: '#ead2e2',
    400: '#bd83b6',
    500: '#683266',
    600: '#310f32',
  },
  bg: {
    100: '#fefcff',
    400: '#fbf5ff',
    500: '#faf2ff',
  },
  brand: {
    300: '#f4c4da',
    400: '#e77abb',
    500: '#c92c97',
    gradientStart: '#c92b97',
    gradientEnd: '#ba28bf',
  },
  secondary: {
    500: '#bb28bf',
  },
} as const

export const typography = {
  h1: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '67px',
    fontWeight: 800,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  h1Sub: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '38px',
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  h2: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '50px',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  label1: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '28px',
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '0',
  },
  label2: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '21px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '0',
  },
  label3: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '21px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0',
  },
  label4: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '21px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  label6: {
    fontFamily: 'var(--font-poppins)',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '0',
  },
  paragraph1: {
    fontFamily: 'var(--font-inter)',
    fontSize: '21px',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0',
  },
  paragraph3: {
    fontFamily: 'var(--font-inter)',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  paragraph4: {
    fontFamily: 'var(--font-inter)',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
} as const

export const spacing = {
  pageX: '120px',
  headerTop: '40px',
  sectionGap: '24px',
  columnGap: '49px',
  buttonGap: '20px',
  buttonX: '52px',
  buttonY: '13px',
  buttonNavX: '38px',
  buttonNavY: '12px',
  navX: '33px',
  navY: '14px',
  navItemX: '24px',
  navItemY: '8px',
  paragraphInset: '10px',
} as const
