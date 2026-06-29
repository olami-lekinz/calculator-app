import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { theme } from '../theme';
import { nPr as computeNPr, nCr as computeNCr, calculateStats, StatResult, cleanFloat } from '../mathEngine';

interface InputModalProps {
  visible: boolean;
  type: 'nPr' | 'nCr' | 'STAT' | null;
  onClose: () => void;
  onConfirm: (result: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({ visible, type, onClose, onConfirm }) => {
  const [nInput, setNInput] = useState('');
  const [rInput, setRInput] = useState('');
  const [statInput, setStatInput] = useState('');
  const [statResults, setStatResults] = useState<StatResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset inputs when modal opens or shifts type
  useEffect(() => {
    if (visible) {
      setNInput('');
      setRInput('');
      setStatInput('');
      setStatResults(null);
      setErrorMsg(null);
    }
  }, [visible, type]);

  const handleCalculateCombinatorics = () => {
    setErrorMsg(null);
    const n = parseInt(nInput, 10);
    const r = parseInt(rInput, 10);

    if (isNaN(n) || isNaN(r)) {
      setErrorMsg('Please enter valid integers for both n and r.');
      return;
    }

    if (n < 0 || r < 0) {
      setErrorMsg('n and r must be non-negative integers.');
      return;
    }

    if (r > n) {
      setErrorMsg('r cannot be greater than n.');
      return;
    }

    try {
      const res = type === 'nPr' ? computeNPr(n, r) : computeNCr(n, r);
      onConfirm(cleanFloat(res).toString());
    } catch (e) {
      setErrorMsg('Calculation error. Number too large?');
    }
  };

  const handleCalculateStats = () => {
    setErrorMsg(null);
    setStatResults(null);
    
    // Split by commas, parse floats, and filter out invalid/empty strings
    const numbers = statInput
      .split(',')
      .map(x => x.trim())
      .filter(x => x !== '')
      .map(Number);

    if (numbers.length === 0 || numbers.some(isNaN)) {
      setErrorMsg('Please enter a valid list of comma-separated numbers.');
      return;
    }

    try {
      const results = calculateStats(numbers);
      setStatResults(results);
    } catch (e) {
      setErrorMsg('Failed to calculate statistics.');
    }
  };

  const renderContent = () => {
    if (type === 'nPr' || type === 'nCr') {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.modalTitle}>
            Compute {type === 'nPr' ? 'Permutations (nPr)' : 'Combinations (nCr)'}
          </Text>
          <Text style={styles.subtitle}>Formula: {type === 'nPr' ? 'n! / (n-r)!' : 'n! / (r!(n-r)!)'}</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Enter n</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={nInput}
                onChangeText={setNInput}
                placeholder="e.g. 5"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Enter r</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={rInput}
                onChangeText={setRInput}
                placeholder="e.g. 3"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
          </View>

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmBtn} onPress={handleCalculateCombinatorics}>
              <Text style={styles.confirmBtnText}>Insert Result</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    if (type === 'STAT') {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.modalTitle}>Statistics Analyzer</Text>
          <Text style={styles.subtitle}>Enter numbers separated by commas:</Text>

          <TextInput
            style={[styles.textInput, styles.largeInput]}
            keyboardType="default"
            value={statInput}
            onChangeText={setStatInput}
            placeholder="e.g. 10, 15, 23.5, -4, 18"
            placeholderTextColor={theme.colors.textMuted}
            multiline
          />

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          {statResults && (
            <View style={styles.resultsBox}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Mean (μ):</Text>
                <Text style={styles.resultValue}>{cleanFloat(statResults.mean)}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Median:</Text>
                <Text style={styles.resultValue}>{cleanFloat(statResults.median)}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Mode:</Text>
                <Text style={styles.resultValue}>
                  {statResults.mode.length === 0 
                    ? 'None' 
                    : statResults.mode.map(cleanFloat).join(', ')}
                </Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Variance (σ²):</Text>
                <Text style={styles.resultValue}>{cleanFloat(statResults.variance)}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Std Dev (σ):</Text>
                <Text style={styles.resultValue}>{cleanFloat(statResults.stdDev)}</Text>
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Close</Text>
            </Pressable>
            <Pressable style={styles.confirmBtn} onPress={handleCalculateStats}>
              <Text style={styles.confirmBtnText}>Calculate</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalWrapper}
          >
            {renderContent()}
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // semi-transparent backdrop overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 24,
  },
  modalTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputWrapper: {
    width: '47%',
  },
  inputLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
  },
  largeInput: {
    height: 70,
    textAlignVertical: 'top',
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultsBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  resultLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    color: theme.colors.textMuted,
  },
  resultValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    width: '45%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  confirmBtn: {
    width: '45%',
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.accent, // uses accent color for confirm button
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
