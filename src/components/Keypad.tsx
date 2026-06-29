import React from 'react';
import { StyleSheet, View, Text, Pressable, useWindowDimensions } from 'react-native';
import { theme } from '../theme';
import { basicKeys, scientificKeys, KeyConfig } from '../keyLayouts';
import { CalcButton } from './CalcButton';

interface KeypadProps {
  mode: 'basic' | 'scientific';
  setMode: (mode: 'basic' | 'scientific') => void;
  onKeyPress: (value: string) => void;
}

// Utility to chunk scientific keys into rows of 4
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const Keypad: React.FC<KeypadProps> = ({ mode, setMode, onKeyPress }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Dynamic layout calculations
  const keypadPadding = 16;
  const keyGap = 4;
  const numColumns = 4;
  
  // Available width for keys after padding
  const availableWidth = screenWidth - (keypadPadding * 2);
  // Column width calculated with gaps
  const colWidth = (availableWidth - (keyGap * (numColumns - 1))) / numColumns;

  // Decide which keys to render in the grid
  const keysToRender = mode === 'basic' 
    ? basicKeys 
    : chunkArray(scientificKeys, numColumns);

  return (
    <View style={styles.container}>
      {/* Mode Selector Segmented Control */}
      <View style={styles.segmentedContainer}>
        <Pressable
          style={[
            styles.segment,
            mode === 'basic' && styles.activeSegment,
            { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }
          ]}
          onPress={() => setMode('basic')}
        >
          <Text
            style={[
              styles.segmentText,
              mode === 'basic' && styles.activeSegmentText
            ]}
          >
            Basic
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.segment,
            mode === 'scientific' && styles.activeSegment,
            { borderTopRightRadius: 10, borderBottomRightRadius: 10 }
          ]}
          onPress={() => setMode('scientific')}
        >
          <Text
            style={[
              styles.segmentText,
              mode === 'scientific' && styles.activeSegmentText
            ]}
          >
            Scientific
          </Text>
        </Pressable>
      </View>

      {/* Grid containing selected mode operations */}
      <View style={styles.gridContainer}>
        {keysToRender.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((item) => (
              <CalcButton
                key={item.label}
                item={item}
                onPress={onKeyPress}
                width={colWidth}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: theme.colors.background,
  },
  segmentedContainer: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: theme.colors.accent,
  },
  segmentText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  activeSegmentText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.bold,
  },
  gridContainer: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
});
