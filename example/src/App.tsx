import { Text, View, StyleSheet } from 'react-native';
import { multiply } from 'react-native-tipkit';

const result = multiply({ n1: 3, n2: 7 });

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
