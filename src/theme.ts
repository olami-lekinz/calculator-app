/**
 * Theme Definitions matching the computed design selections.
 * Color Scheme: Twilight Indigo (index 5)
 * Key Shape: Rounded Squares (index 1)
 * Typography: Outfit (index 4)
 * Accent Color: Violet (#7C4DFF)
 * Display Style: Full-Width Flush (index 2)
 */

export const theme = {
  colors: {
    background: '#2E2B4E',
    surface: '#3D3968',
    text: '#D8D3F0',
    textMuted: '#8982AF',
    border: '#4E4980',
    accent: '#7C4DFF',
    accentPressed: '#9E7BFF',
    keyBg: '#3D3968',
    keyBgPressed: '#4E4980',
    
    // Specific key overrides
    equalsBg: '#7C4DFF',
    equalsText: '#FFFFFF',
    opText: '#7C4DFF',
    actionText: '#FF6B6B', // Delete / Clear
  },
  fonts: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    bold: 'Outfit_700Bold',
  },
  keyShape: {
    borderRadius: 14,   // Rounded Squares
    aspectRatio: 1.0,  // Equal width and height
  },
  displayStyle: {
    type: 'Full-Width Flush',
  }
};
