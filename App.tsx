import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';

import { theme } from './src/theme';
import { Display } from './src/components/Display';
import { Keypad } from './src/components/Keypad';
import { InputModal } from './src/components/InputModal';
import { evaluateExpression, evaluateLivePreview } from './src/mathEngine';

export default function App() {
  // Load custom Google Fonts
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
  });

  const [mode, setMode] = useState<'basic' | 'scientific'>('basic');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isFinalResult, setIsFinalResult] = useState(false);
  const [modalType, setModalType] = useState<'nPr' | 'nCr' | 'STAT' | null>(null);

  // Update live preview as the user types
  useEffect(() => {
    if (isFinalResult) return;

    if (!expression || expression.trim() === '') {
      setResult('0');
      return;
    }

    const preview = evaluateLivePreview(expression);
    if (preview !== '') {
      setResult(preview);
    }
  }, [expression, isFinalResult]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  const handleKeyPress = (val: string) => {
    // 1. Recover from Error state automatically on any key press
    if (result === 'Error') {
      setExpression('');
      setResult('0');
      setIsFinalResult(false);
      if (val === 'AC') return;
    }

    // 2. Handle AC (All Clear)
    if (val === 'AC') {
      setExpression('');
      setResult('0');
      setIsFinalResult(false);
      return;
    }

    // 3. Handle DEL (Delete)
    if (val === 'DEL') {
      if (isFinalResult) {
        // After =, DEL clears the expression and resets
        setExpression('');
        setResult('0');
        setIsFinalResult(false);
        return;
      }
      setExpression((prev) => {
        if (!prev) return '';
        
        // Multi-char functions/constants list
        const functions = [
          'asin(', 'acos(', 'atan(', 
          'sinh(', 'cosh(', 'tanh(', 
          'sqrt(', 'sin(', 'cos(', 'tan(', 
          'ln(', 'log('
        ];
        
        for (const f of functions) {
          if (prev.endsWith(f)) {
            return prev.slice(0, -f.length);
          }
        }

        if (prev.endsWith('pi')) {
          return prev.slice(0, -2);
        }

        return prev.slice(0, -1);
      });
      return;
    }

    // 4. Handle Modal buttons
    if (val === 'nPr' || val === 'nCr' || val === 'STAT') {
      setModalType(val as 'nPr' | 'nCr' | 'STAT');
      return;
    }

    // 5. Handle Evaluate (=)
    if (val === '=') {
      if (!expression || expression.trim() === '') return;
      const res = evaluateExpression(expression);
      setResult(res);
      setIsFinalResult(true);
      return;
    }

    // 6. Handle standard operands and operators
    const isOperator = ['+', '-', '*', '/', '^', '^2'].includes(val);

    if (isFinalResult) {
      if (isOperator) {
        // If user presses operator after equals, continue from the previous result
        if (val === '^2') {
          setExpression(result + '^2');
        } else {
          setExpression(result + val);
        }
      } else {
        // If user presses digit or function after equals, clear and start fresh
        if (val === '^2') {
          setExpression('0^2');
        } else {
          setExpression(val);
        }
      }
      setIsFinalResult(false);
    } else {
      // Normal appending
      setExpression((prev) => prev + val);
    }
  };

  const handleModalConfirm = (resultVal: string) => {
    setModalType(null);

    // If modal is nPr or nCr, insert the calculated value
    if (isFinalResult) {
      setExpression(resultVal);
      setIsFinalResult(false);
    } else {
      setExpression((prev) => prev + resultVal);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={theme.colors.background} translucent={false} />
      
      <View style={styles.appContainer}>
        {/* Output Display */}
        <Display
          expression={expression}
          result={result}
          isFinalResult={isFinalResult}
        />

        {/* Buttons Keypad */}
        <View style={styles.keypadContainer}>
          <Keypad
            mode={mode}
            setMode={setMode}
            onKeyPress={handleKeyPress}
          />
        </View>
      </View>

      {/* Helper Input Modals */}
      <InputModal
        visible={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
        onConfirm={handleModalConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  keypadContainer: {
    flexShrink: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
