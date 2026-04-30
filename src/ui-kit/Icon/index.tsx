import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

// Basic emoji icons - có thể thay bằng icon library như @expo/vector-icons
const iconMap: Record<string, string> = {
  heart: '❤️',
  'heart-outline': '🤍',
  star: '⭐',
  'star-outline': '☆',
  search: '🔍',
  settings: '⚙️',
  back: '←',
  forward: '→',
  check: '✓',
  close: '✕',
  plus: '+',
  minus: '−',
  up: '↑',
  down: '↓',
  chart: '📈',
  user: '👤',
  lock: '🔒',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#000',
  style,
}) => {
  const icon = iconMap[name] || '•';

  return (
    <Text style={[styles.icon, { fontSize: size }, style]}>
      {icon}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
