import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { theme } from '../theme';

interface DisplayProps {
  expression: string;
  result: string;
  isFinalResult: boolean;
}

export const Display: React.FC<DisplayProps> = ({ expression, result, isFinalResult }) => {
  const exprScrollRef = useRef<ScrollView>(null);
  const resultScrollRef = useRef<ScrollView>(null);

  // Auto scroll to end when content updates (extremely helpful for long inputs)
  const handleExprContentSizeChange = () => {
    exprScrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleResultContentSizeChange = () => {
    resultScrollRef.current?.scrollToEnd({ animated: true });
  };

  // Prettify expression for user presentation
  const prettify = (expr: string): string => {
    if (!expr) return '';
    return expr
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/asin\(/g, 'sin⁻¹(')
      .replace(/acos\(/g, 'cos⁻¹(')
      .replace(/atan\(/g, 'tan⁻¹(')
      .replace(/sqrt\(/g, '√(')
      .replace(/pi/g, 'π')
      .replace(/u-/g, '–') // Display unary minus as pretty dash
      .replace(/-/g, '–');
  };

  const displayExpr = expression || '0';
  const displayResult = result || '';

  return (
    <View style={styles.container}>
      {/* Expression Area */}
      <View style={styles.expressionContainer}>
        <ScrollView
          ref={exprScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={handleExprContentSizeChange}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.expressionText}>
            {prettify(displayExpr)}
          </Text>
        </ScrollView>
      </View>

      {/* Result Area */}
      <View style={styles.resultContainer}>
        <ScrollView
          ref={resultScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={handleResultContentSizeChange}
          contentContainerStyle={styles.scrollContentRight}
        >
          <Text
            style={[
              styles.resultText,
              { color: isFinalResult ? theme.colors.text : theme.colors.textMuted }
            ]}
          >
            {displayResult}
          </Text>
        </ScrollView>
      </View>

      {/* Thin divider separating keypad from display (Full-Width Flush requirement) */}
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.background,
    paddingTop: 30,
    paddingBottom: 15,
  },
  expressionContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  resultContainer: {
    height: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  scrollContent: {
    alignItems: 'center',
  },
  scrollContentRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  expressionText: {
    fontFamily: theme.fonts.regular,
    fontSize: 22,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  resultText: {
    fontFamily: theme.fonts.bold,
    fontSize: 42,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '100%',
    marginTop: 15,
  },
});
