/**
 * Math Engine for Scientific Calculator
 * Pure TypeScript. Zero external dependencies.
 */

// --- FACTORIAL HELPER ---
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial of negative or non-integer");
  }
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JS represents values larger than 1.79e308 as Infinity
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// --- COMBINATORICS HELPERS ---
export function nPr(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error("Parameters must be non-negative integers");
  }
  if (r > n) return 0;
  return factorial(n) / factorial(n - r);
}

export function nCr(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error("Parameters must be non-negative integers");
  }
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

// --- STATISTICS HELPERS ---
export interface StatResult {
  mean: number;
  variance: number;
  stdDev: number;
  median: number;
  mode: number[];
}

export function calculateStats(numbers: number[]): StatResult {
  if (numbers.length === 0) {
    throw new Error("Empty list");
  }
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const mean = sum / numbers.length;
  const squareDiffs = numbers.map(x => Math.pow(x - mean, 2));
  const variance = squareDiffs.reduce((acc, val) => acc + val, 0) / numbers.length;
  const stdDev = Math.sqrt(variance);

  // Median calculation
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 
    ? sorted[mid] 
    : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode calculation
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  for (const num of numbers) {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
    }
  }

  // If max frequency is 1 (and there are multiple numbers), there is no mode by statistical definition
  const mode = (maxFreq === 1 && numbers.length > 1)
    ? []
    : Object.keys(frequency).map(Number).filter(num => frequency[num] === maxFreq);

  return {
    mean,
    variance,
    stdDev,
    median,
    mode
  };
}

// --- FLOATING POINT CLEANUP ---
export function cleanFloat(val: number): number {
  if (!Number.isFinite(val)) return val;
  // Use toPrecision(10) to clear floating point artifacts and convert back to float
  return parseFloat(val.toPrecision(10));
}

// --- TOKENIZER ---
export function tokenize(expr: string): string[] {
  // Remove spaces
  expr = expr.replace(/\s+/g, "");
  
  const tokens: string[] = [];
  let i = 0;
  
  const isDigit = (c: string) => (c >= '0' && c <= '9') || c === '.';
  const isLetter = (c: string) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  
  while (i < expr.length) {
    const char = expr[i];
    
    // Multi-digit numbers
    if (isDigit(char)) {
      let numStr = "";
      while (i < expr.length && isDigit(expr[i])) {
        numStr += expr[i];
        i++;
      }
      tokens.push(numStr);
      continue;
    }
    
    // Alphabetic words (functions like sin, cos, ln, etc., or constants like pi, e)
    if (isLetter(char)) {
      let wordStr = "";
      while (i < expr.length && isLetter(expr[i])) {
        wordStr += expr[i];
        i++;
      }
      tokens.push(wordStr);
      continue;
    }
    
    // Operators and brackets
    if (
      char === '+' || char === '-' || char === '*' || char === '/' ||
      char === '^' || char === '!' || char === '(' || char === ')'
    ) {
      tokens.push(char);
      i++;
      continue;
    }
    
    // Skip unknown symbols
    i++;
  }
  
  return tokens;
}

// --- TOKEN PROCESSOR (Unary minus & Implicit Multiplication) ---
const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 
  'sinh', 'cosh', 'tanh', 'sqrt', 'ln', 'log'
]);

function isFunction(token: string): boolean {
  return FUNCTIONS.has(token);
}

export function processTokens(rawTokens: string[]): string[] {
  const tokens: string[] = [];
  
  for (let idx = 0; idx < rawTokens.length; idx++) {
    const curr = rawTokens[idx];
    const prev = idx > 0 ? tokens[tokens.length - 1] : null;
    
    if (curr === '-') {
      // Determine if unary or binary minus
      const isUnary = !prev || 
                      prev === '+' || 
                      prev === '-' || 
                      prev === '*' || 
                      prev === '/' || 
                      prev === '^' || 
                      prev === '(' ||
                      prev === 'u-';
      
      if (isUnary) {
        tokens.push('u-');
      } else {
        tokens.push('-');
      }
      continue;
    }
    
    // Insert implicit multiplication (*)
    if (prev) {
      // Check if previous token is an operand-ender
      const isPrevOperand = !isNaN(Number(prev)) || prev === 'pi' || prev === 'e' || prev === ')' || prev === '!';
      
      // Check if current token is an operand-starter
      const isCurrOperandStarter = !isNaN(Number(curr)) || 
                                   curr === 'pi' || 
                                   curr === 'e' || 
                                   curr === '(' ||
                                   isFunction(curr);
      
      if (isPrevOperand && isCurrOperandStarter) {
        tokens.push('*');
      }
    }
    
    tokens.push(curr);
  }
  
  return tokens;
}

// --- SHUNTING YARD ALGORITHM ---
export function shuntingYard(tokens: string[]): string[] {
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];
  
  const precedence: Record<string, number> = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    'u-': 3.5, // Unary minus precedence
    '^': 4,
  };
  
  const isOperator = (t: string) => precedence[t] !== undefined;
  
  for (const token of tokens) {
    if (!isNaN(Number(token)) || token === 'pi' || token === 'e') {
      outputQueue.push(token);
    } else if (isFunction(token)) {
      operatorStack.push(token);
    } else if (token === '!') {
      // Factorial is postfix - pushes immediately to outputs
      outputQueue.push('!');
    } else if (isOperator(token)) {
      const pToken = precedence[token];
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top === '(') break;
        
        const pTop = precedence[top] || 5; // Functions have highest precedence
        
        // Right-associative operator rules
        const isRightAssoc = token === '^' || token === 'u-';
        if (isRightAssoc ? pTop > pToken : pTop >= pToken) {
          outputQueue.push(operatorStack.pop()!);
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      let foundOpen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top === '(') {
          operatorStack.pop();
          foundOpen = true;
          break;
        } else {
          outputQueue.push(operatorStack.pop()!);
        }
      }
      if (!foundOpen) {
        throw new Error("Mismatched brackets");
      }
      // If function was preceding, pop it to output
      if (operatorStack.length > 0 && isFunction(operatorStack[operatorStack.length - 1])) {
        outputQueue.push(operatorStack.pop()!);
      }
    } else {
      throw new Error(`Unknown token: ${token}`);
    }
  }
  
  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top === '(' || top === ')') {
      throw new Error("Mismatched brackets");
    }
    outputQueue.push(top);
  }
  
  return outputQueue;
}

// --- EVALUATOR ---
function evaluateFunction(func: string, x: number): number {
  switch (func) {
    case 'sin':
      return Math.sin(x * Math.PI / 180);
    case 'cos':
      return Math.cos(x * Math.PI / 180);
    case 'tan': {
      // Handle asymptotes for tan(90 + 180k)
      const absMod = Math.abs((x - 90) % 180);
      if (absMod < 1e-9 || absMod > 180 - 1e-9) {
        throw new Error("Division by zero");
      }
      return Math.tan(x * Math.PI / 180);
    }
    case 'asin':
      if (x < -1 || x > 1) throw new Error("asin out of range");
      return Math.asin(x) * 180 / Math.PI;
    case 'acos':
      if (x < -1 || x > 1) throw new Error("acos out of range");
      return Math.acos(x) * 180 / Math.PI;
    case 'atan':
      return Math.atan(x) * 180 / Math.PI;
    case 'sinh':
      return Math.sinh(x);
    case 'cosh':
      return Math.cosh(x);
    case 'tanh':
      return Math.tanh(x);
    case 'sqrt':
      if (x < 0) throw new Error("sqrt of negative");
      return Math.sqrt(x);
    case 'ln':
      if (x <= 0) throw new Error("ln of non-positive");
      return Math.log(x);
    case 'log':
      if (x <= 0) throw new Error("log of non-positive");
      return Math.log10(x);
    default:
      throw new Error(`Unknown function: ${func}`);
  }
}

function evaluateBinaryOp(op: string, a: number, b: number): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    case '^':
      if (a < 0 && !Number.isInteger(b)) {
        throw new Error("sqrt of negative"); // non-real result for fraction exponent of negative
      }
      return Math.pow(a, b);
    default:
      throw new Error(`Unknown operator: ${op}`);
  }
}

export function evaluateRPN(rpn: string[]): number {
  const stack: number[] = [];
  
  for (const token of rpn) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else if (token === 'pi') {
      stack.push(Math.PI);
    } else if (token === 'e') {
      stack.push(Math.E);
    } else if (token === 'u-') {
      if (stack.length < 1) throw new Error("Malformed expression");
      const val = stack.pop()!;
      stack.push(-val);
    } else if (token === '!') {
      if (stack.length < 1) throw new Error("Malformed expression");
      const val = stack.pop()!;
      stack.push(factorial(val));
    } else if (isFunction(token)) {
      if (stack.length < 1) throw new Error("Malformed expression");
      const val = stack.pop()!;
      stack.push(evaluateFunction(token, val));
    } else {
      if (stack.length < 2) throw new Error("Malformed expression");
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(evaluateBinaryOp(token, a, b));
    }
  }
  
  if (stack.length !== 1) {
    throw new Error("Malformed expression");
  }
  
  return stack[0];
}

// --- EXTERNAL-FACING EXPRESSION EVALUATION ---
export function evaluateExpression(expr: string): string {
  try {
    const rawTokens = tokenize(expr);
    const tokens = processTokens(rawTokens);
    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn);
    
    if (isNaN(result)) return "Error";
    
    const cleaned = cleanFloat(result);
    return cleaned.toString();
  } catch (error) {
    return "Error";
  }
}

// --- LIVE PREVIEW WITH AUTOMATIC HEURISTICS ---
export function evaluateLivePreview(expr: string): string {
  try {
    const trimmed = expr.trim();
    if (!trimmed || trimmed === "0" || trimmed === "") return "";
    
    let tempExpr = trimmed;
    
    // Auto-close brackets for live evaluation
    let openBrackets = 0;
    for (let idx = 0; idx < tempExpr.length; idx++) {
      if (tempExpr[idx] === '(') openBrackets++;
      if (tempExpr[idx] === ')') openBrackets--;
    }
    while (openBrackets > 0) {
      tempExpr += ')';
      openBrackets--;
    }
    
    const rawTokens = tokenize(tempExpr);
    const tokens = processTokens(rawTokens);
    
    if (tokens.length > 0) {
      const last = tokens[tokens.length - 1];
      const binaryOps = ['+', '-', '*', '/', '^'];
      if (binaryOps.includes(last) || last === 'u-') {
        tokens.pop(); // Strip trailing operator
      }
    }
    
    if (tokens.length === 0) return "";
    
    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn);
    
    if (isNaN(result) || !Number.isFinite(result)) return "";
    
    return cleanFloat(result).toString();
  } catch (error) {
    return ""; // Silent failure during typing
  }
}
