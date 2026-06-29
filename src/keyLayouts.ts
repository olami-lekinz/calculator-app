/**
 * Key Layout definitions for the Basic and Scientific panels.
 * Fits the Compact Two-Panel layout configuration.
 */

export interface KeyConfig {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'function' | 'constant' | 'action';
}

// Scientific Panel keys - shown in a scrollable horizontal row at the top
export const scientificKeys: KeyConfig[] = [
  { label: 'sin', value: 'sin(', type: 'function' },
  { label: 'cos', value: 'cos(', type: 'function' },
  { label: 'tan', value: 'tan(', type: 'function' },
  { label: 'sin⁻¹', value: 'asin(', type: 'function' },
  { label: 'cos⁻¹', value: 'acos(', type: 'function' },
  { label: 'tan⁻¹', value: 'atan(', type: 'function' },
  { label: 'sinh', value: 'sinh(', type: 'function' },
  { label: 'cosh', value: 'cosh(', type: 'function' },
  { label: 'tanh', value: 'tanh(', type: 'function' },
  { label: '√', value: 'sqrt(', type: 'function' },
  { label: 'ln', value: 'ln(', type: 'function' },
  { label: 'log', value: 'log(', type: 'function' },
  { label: 'x²', value: '^2', type: 'operator' },
  { label: '^', value: '^', type: 'operator' },
  { label: 'π', value: 'pi', type: 'constant' },
  { label: 'e', value: 'e', type: 'constant' },
  { label: 'nPr', value: 'nPr', type: 'action' },
  { label: 'nCr', value: 'nCr', type: 'action' },
  { label: 'STAT', value: 'STAT', type: 'action' },
];

// Basic Panel keys - standard 4-column layout below
export const basicKeys: KeyConfig[][] = [
  [
    { label: '(', value: '(', type: 'operator' },
    { label: ')', value: ')', type: 'operator' },
    { label: 'DEL', value: 'DEL', type: 'action' },
    { label: 'AC', value: 'AC', type: 'action' },
  ],
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '÷', value: '/', type: 'operator' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '–', value: '-', type: 'operator' }, // Rendered dash, but value is standard minus
  ],
  [
    { label: '0', value: '0', type: 'number' },
    { label: '.', value: '.', type: 'number' },
    { label: '=', value: '=', type: 'action' },
    { label: '+', value: '+', type: 'operator' },
  ],
];
