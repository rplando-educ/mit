import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function Screen({ children, scroll = true, scrollEnabled = true, style }) {
  const insets = useSafeAreaInsets();
  const contentStyle = [styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }, style];

  if (!scroll) {
    return <View style={contentStyle}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={contentStyle}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      scrollEnabled={scrollEnabled}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
  },
});
