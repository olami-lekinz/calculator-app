import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';
import { KeyConfig } from '../keyLayouts';

interface CalcButtonProps {
  item: KeyConfig;
  onPress: (val: string) => void;
  width: number;
}

export const CalcButton: React.FC<CalcButtonProps> = ({ item, onPress, width }) => {
  const height = width / theme.keyShape.aspectRatio;

  // Determine button styles based on key type
  const getButtonStyles = (pressed: boolean): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      width,
      height,
      borderRadius: theme.keyShape.borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.keyBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      
      // Shadow styles for depth (since it's a mid-tone theme)
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    };

    if (item.label === '=') {
      baseStyle.backgroundColor = pressed ? theme.colors.accentPressed : theme.colors.equalsBg;
      baseStyle.borderColor = 'transparent';
    } else if (item.label === 'AC' || item.label === 'DEL') {
      if (pressed) {
        baseStyle.backgroundColor = '#4D242E'; // Darkened action background
      }
    } else if (pressed) {
      baseStyle.backgroundColor = theme.colors.keyBgPressed;
    }

    return [baseStyle];
  };

  // Determine text styles based on key type
  const getTextStyles = (): TextStyle => {
    const baseText: TextStyle = {
      fontFamily: theme.fonts.medium,
      fontSize: width > 70 ? 20 : 16,
      color: theme.colors.text,
    };

    if (item.label === '=') {
      baseText.color = theme.colors.equalsText;
      baseText.fontFamily = theme.fonts.bold;
    } else if (item.label === 'AC' || item.label === 'DEL') {
      baseText.color = theme.colors.actionText;
      baseText.fontFamily = theme.fonts.bold;
    } else if (item.type === 'operator') {
      baseText.color = theme.colors.opText;
    } else if (item.type === 'function') {
      baseText.color = theme.colors.opText;
      baseText.fontSize = width > 70 ? 18 : 14;
    }

    return baseText;
  };

  return (
    <Pressable
      onPress={() => onPress(item.value)}
      style={({ pressed }) => getButtonStyles(pressed)}
    >
      <Text style={getTextStyles()}>{item.label}</Text>
    </Pressable>
  );
};
