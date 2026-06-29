# PRD — Mobile Scientific Calculator
## SEN 104 & SEN 214 Assignment (React Native + Expo)

---

## 1. Project Overview
Build a cross-platform mobile Scientific Calculator using React Native (Expo)
and TypeScript. The app supports Basic and Scientific modes. All math logic
must use JavaScript's native Math object only — no external math libraries.

### CRITICAL: Deterministic Design Selection
This app's visual design is NOT up to the agent's preference. Section 5
defines a mandatory selection algorithm that uses the student's name and
matric number to deterministically pick a unique combination of colors,
shapes, layout, font, accent, and display style.

**The agent MUST NOT skip, override, or "improve" the selections.**
**The agent MUST NOT default to dark theme unless the algorithm selects it.**

---

## 2. Tech Stack & Constraints
- Framework: React Native via Expo (latest stable SDK)
- Language: TypeScript (strict mode)
- Styling: React Native StyleSheet only
- Navigation: Single screen app — no expo-router, no react-navigation
- Fonts: One @expo-google-fonts package matching the assigned typography
- Must run on: Expo Go (dev), Android APK (final submission)

---

## 3. Project Structure
Agent must create files in this exact structure:

calculator-app/
├── App.tsx
├── src/
│   ├── mathEngine.ts
│   ├── theme.ts
│   ├── keyLayouts.ts
│   └── components/
│       ├── Display.tsx
│       ├── Keypad.tsx
│       ├── CalcButton.tsx
│       └── InputModal.tsx

No placeholder comments. Every file must be fully implemented.

---

## 4. Math Engine (src/mathEngine.ts)
Pure TypeScript, no imports except JS built-ins.

### Pipeline
1. Tokenizer — splits input into numbers, operators,
   functions, constants, brackets, factorials.
   Must handle unary minus vs binary minus.
2. Shunting-Yard — converts tokens to RPN respecting
   precedence. Power operator (^) is right-associative.
3. RPN Evaluator — processes RPN stack and returns number.

### Operations Required
Basic: +  -  *  /  ^  !  ( )
Trig (in degrees): sin cos tan asin acos atan sinh cosh tanh
Power/Log: sqrt  ln  log  x²
Constants: π  e
Combinatorics (via modal): nPr  nCr
Statistics (via modal): mean  variance  standard deviation

### Error Handling
Return "Error" string (not throw) for:
- Division by zero
- sqrt of negative
- asin/acos out of range
- Factorial of negative or non-integer
- Malformed expression
- Mismatched brackets

### Float cleanup
Round results to 10 significant figures to eliminate
floating point noise (e.g. 0.1+0.2 = 0.3 not 0.30000000000000004)

---

## 5. Design Randomization — MANDATORY DETERMINISTIC SELECTION

### ⚠️ THIS SECTION IS A HARD CONSTRAINT, NOT A SUGGESTION

The agent MUST follow the algorithm below exactly. The agent does NOT
get to "choose" or "prefer" any option. The algorithm decides.

### 5.0 Selection Algorithm

The student will provide two values:
- **FIRST_NAME** — their first name (e.g. "Samuel")
- **MATRIC_LAST_TWO** — last two digits of their matric number (e.g. "47")

The agent must compute indices as follows:

```
LETTER_INDEX = (ASCII code of uppercase first letter of FIRST_NAME) - 65
  Example: "Samuel" → 'S' → ASCII 83 → 83 - 65 = 18

MATRIC_NUM = integer value of MATRIC_LAST_TWO
  Example: "47" → 47
```

Then select from each category using modular arithmetic:

```
Color Scheme  = OPTIONS_5_1[ (LETTER_INDEX + MATRIC_NUM) % 12 ]
Key Shape     = OPTIONS_5_2[ (LETTER_INDEX * 2 + MATRIC_NUM) % 6 ]
Layout        = OPTIONS_5_3[ (MATRIC_NUM * 3 + LETTER_INDEX) % 6 ]
Typography    = OPTIONS_5_4[ (LETTER_INDEX + MATRIC_NUM * 2) % 8 ]
Accent Color  = OPTIONS_5_5[ (MATRIC_NUM + LETTER_INDEX * 3) % 5 ]
Display Style = OPTIONS_5_6[ (LETTER_INDEX * MATRIC_NUM) % 4 ]
```

**The agent MUST print the computed indices and final selections
before writing ANY code. Format:**

```
=== DESIGN SELECTION (DO NOT MODIFY) ===
Student: [FIRST_NAME]
Matric Last Two: [MATRIC_LAST_TWO]
LETTER_INDEX: [value]
MATRIC_NUM: [value]

Color Scheme:  [index] → [name]
Key Shape:     [index] → [name]
Layout:        [index] → [name]
Typography:    [index] → [name + npm package]
Accent Color:  [index] → [name + hex]
Display Style: [index] → [name]
========================================
```

---

### 5.1 Color Scheme (12 options, index 0–11)

**DARK THEMES (0–3):**

0) **Midnight Obsidian**
   - Background: #0D0D0D
   - Surface/Keys: #1A1A2E
   - Text: #E0E0E0
   - Subtle border: #2A2A3E

1) **Deep Ocean**
   - Background: #0B1622
   - Surface/Keys: #142D4C
   - Text: #D4E4F7
   - Subtle border: #1E3A5F

2) **Charcoal Slate**
   - Background: #1B1B1F
   - Surface/Keys: #2D2D35
   - Text: #CACAD0
   - Subtle border: #3A3A45

3) **Volcanic Black**
   - Background: #110F0F
   - Surface/Keys: #251E1E
   - Text: #E8D5D5
   - Subtle border: #3A2E2E

**MID-TONE THEMES (4–7):**

4) **Warm Stone**
   - Background: #3C3633
   - Surface/Keys: #504A46
   - Text: #F0E6D9
   - Subtle border: #635C57

5) **Twilight Indigo**
   - Background: #2E2B4E
   - Surface/Keys: #3D3968
   - Text: #D8D3F0
   - Subtle border: #4E4980

6) **Steel Blue**
   - Background: #2C3E50
   - Surface/Keys: #34495E
   - Text: #D6E4F0
   - Subtle border: #415B76

7) **Forest Dusk**
   - Background: #2D3A2E
   - Surface/Keys: #3D4F3E
   - Text: #D4E4D5
   - Subtle border: #4D604E

**LIGHT THEMES (8–11):**

8) **Arctic Frost**
   - Background: #F0F2F5
   - Surface/Keys: #FFFFFF
   - Text: #1A1A2E
   - Subtle border: #D0D5DD
   - Key shadow: rgba(0,0,0,0.06)

9) **Warm Cream**
   - Background: #FAF6F0
   - Surface/Keys: #FFFFFF
   - Text: #2C2420
   - Subtle border: #E0D6C8
   - Key shadow: rgba(80,60,40,0.08)

10) **Soft Lavender**
    - Background: #F3F0FA
    - Surface/Keys: #FFFFFF
    - Text: #2A2440
    - Subtle border: #D5CCE8
    - Key shadow: rgba(60,40,100,0.06)

11) **Mint Cloud**
    - Background: #EFF8F4
    - Surface/Keys: #FFFFFF
    - Text: #1A3028
    - Subtle border: #C8E0D4
    - Key shadow: rgba(30,80,60,0.06)

---

### 5.2 Key Shape (6 options, index 0–5)

0) **Perfect Circles** — fully round keys (borderRadius = width/2),
   floating with 8px gaps between keys

1) **Rounded Squares** — borderRadius 14, equal width and height,
   4px gap, subtle shadow on each key

2) **Soft Squircles** — borderRadius 20, slightly larger than squares,
   smooth continuous corner curves

3) **Pill/Capsule** — borderRadius 999, wider than tall (aspect ~1.8:1),
   horizontal elongated shape

4) **Minimal Flat** — borderRadius 8, no shadow, no border, relies
   only on background color difference to separate keys from surface

5) **Outlined/Wireframe** — transparent key background, 1.5px colored
   border, borderRadius 12, background fill appears only on press

---

### 5.3 Layout (6 options, index 0–5)

0) **Classic Right** — 4-column number grid with operators column
   pinned to the right edge

1) **Classic Left** — 4-column number grid with operators column
   pinned to the left edge

2) **Top-Heavy** — scientific function rows above, basic number grid
   below, operators integrated into the right column

3) **Split Grid** — numbers in center 3 columns, brackets + functions
   on the left column, operators on the right column

4) **Bottom Bar** — operators in a horizontal row below the number
   grid instead of a vertical column

5) **Compact Two-Panel** — two stacked horizontal sections: top panel
   for scientific functions in a scrollable row, bottom panel for the
   standard number + operator grid

---

### 5.4 Typography (8 options, index 0–7)

0) **Orbitron** — geometric futuristic display font
   Package: `@expo-google-fonts/orbitron`

1) **Inter** — clean modern sans-serif, highly legible
   Package: `@expo-google-fonts/inter`

2) **JetBrains Mono** — developer monospace, excellent for numbers
   Package: `@expo-google-fonts/jetbrains-mono`

3) **Space Grotesk** — contemporary geometric sans
   Package: `@expo-google-fonts/space-grotesk`

4) **Outfit** — modern rounded geometric sans
   Package: `@expo-google-fonts/outfit`

5) **Fira Code** — monospace with ligatures, technical feel
   Package: `@expo-google-fonts/fira-code`

6) **Source Code Pro** — Adobe monospace, clean and precise
   Package: `@expo-google-fonts/source-code-pro`

7) **DM Sans** — clean geometric sans, premium feel
   Package: `@expo-google-fonts/dm-sans`

---

### 5.5 Accent Color (5 options, index 0–4)

The accent color is used for: active operator highlight, equals button
background, pressed state tint, toggle indicator, and modal confirm button.

0) **Electric Blue** — #2979FF
1) **Coral** — #FF6B6B
2) **Emerald** — #00C896
3) **Amber Gold** — #FFB300
4) **Violet** — #7C4DFF

**Rules for accent usage:**
- Accent is used sparingly — max 2–3 elements on screen at any time
- Accent MUST have sufficient contrast against the selected color scheme
  background (light themes get the accent as-is, dark themes may need
  the accent lightened by 10%)
- Number keys do NOT use the accent color
- Only operator keys, equals, and active toggles use the accent

---

### 5.6 Display Style (4 options, index 0–3)

0) **Inset Panel** — display area has a subtle inset shadow and a slightly
   darker/lighter background than the main surface, looks recessed

1) **Floating Card** — display area is a separate elevated card with
   borderRadius 16, shadow, and margin from screen edges

2) **Full-Width Flush** — display area spans edge to edge with no border
   or shadow, separated from keypad by a thin 1px divider line

3) **Gradient Fade** — display area has a subtle vertical gradient that
   fades from a slightly tinted version of the accent color (10% opacity)
   at the top to the base background at the bottom

---

### 5.7 Banned Combinations & Overrides

If the algorithm produces any of these, the agent must increment
the Color Scheme index by 1 (wrapping around) until the conflict
is resolved:

- **Accent Amber Gold (#FFB300) + any Light Theme (index 8–11):**
  Insufficient contrast. Shift color scheme index +1.

- **Accent Coral (#FF6B6B) + Volcanic Black (index 3):**
  Red-on-dark-red clash. Shift color scheme index +1.

For all other combinations, use as computed. No exceptions.

---

## 6. Premium Design Requirements

Regardless of which selections the algorithm produces, the app
MUST meet these quality bars:

- **Consistent border radius** across all keys (no mixing round and square)
- **Minimum 12px padding** around the keypad and between key groups
- **Pressed state feedback** on every key (opacity change, scale, or
  background color shift — must be visible and feel responsive)
- **Status bar** must match the app background color (use expo-status-bar)
- **No default React Native text styles** — every Text component must
  use the selected Google Font
- **Display text sizing:** result font ≥ 36px, expression font ≥ 18px
- **SafeAreaView** wrapping the entire app
- **Light themes** must use key shadows for depth; dark themes must use
  subtle border or surface elevation difference

---

## 7. Display (src/components/Display.tsx)
Two text regions stacked vertically:

Top line — Expression:
- Shows equation being typed
- Prettify: * → ×, / → ÷, asin → sin⁻¹, sqrt → √, pi → π
- Horizontally scrollable for long expressions

Bottom line — Result:
- Large prominent font
- Shows live preview while typing (muted color)
- Shows final result after = (full color)
- Horizontally scrollable or auto-shrink for large numbers

---

## 8. Keypad (src/components/Keypad.tsx + CalcButton.tsx)
- Toggle between Basic and Scientific mode via
  segmented control at top
- Basic mode: digits 0–9, . , AC, DEL, =, +, -, ×, ÷, ( )
- Scientific mode: all basic keys + sin cos tan inverses
  hyperbolic sqrt ln log x² ^ π e nPr nCr STAT
- CalcButton must have pressed state visual feedback

---

## 9. Modals (src/components/InputModal.tsx)
Triggered by: nPr, nCr, STAT buttons

nPr modal: two inputs (n, r) → compute n!/(n-r)!
nCr modal: two inputs (n, r) → compute n!/(r!(n-r)!)
STAT modal: one comma-separated input → compute
  mean, variance, standard deviation, display all three

Modal must use the app's accent color for the confirm button
and must have a semi-transparent backdrop overlay.

---

## 10. Behavior Scenarios
1. App opens → display shows 0
2. User types expression → live preview updates
3. User presses = → result shown large, expression above
4. After =, pressing operator → continues from result
5. After =, pressing digit → clears and starts fresh
6. DEL → deletes last token (entire function name at once
   e.g. "sin(" deleted as one unit not char by char)
7. Error → shows "Error", any key press recovers
8. AC → full reset to 0

---

## 11. APK Build Instructions
After completing the app, provide exact commands to:
1. Run on Expo Go (development)
2. Build a release Android APK using EAS Build:
   - npx eas build -p android --profile preview
   - Include eas.json preview profile configuration