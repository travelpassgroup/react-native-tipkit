import { StyleSheet, Pressable, Text } from 'react-native';
import { TipKitInlineView, TipKitPopOverView } from 'react-native-tipkit';
import DonutIcon from './DonutIcon';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useCallback } from 'react';

export default function App() {
  const onActionButtonPress = useCallback(() => {
    console.log('Action button pressed');
  }, []);

  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <TipKitPopOverView
        title="Add New Color"
        description="Tap here to add a new color to the list"
        tipContainer={styles.tipContainer}
        icon={<DonutIcon height={40} width={40} />}
        actionButtonOnPress={onActionButtonPress}
      >
        <Pressable
          style={styles.topButton}
          onPress={() => console.log('Cool feature!')}
        >
          <Text style={styles.buttonText}>Tip you</Text>
        </Pressable>
      </TipKitPopOverView>

      <Animated.Text layout={LinearTransition} style={styles.title}>
        TipKit Example
      </Animated.Text>

      <TipKitInlineView
        title="Set favorites"
        description="Tap and hold a color to add it to your favorites"
        tipContainer={styles.inline}
      />

      <TipKitPopOverView
        // Tip Props
        title="Add New Color"
        description="Tap here to add a new color to the list"
        tipContainer={styles.tipContainer}
        icon={<DonutIcon height={40} width={40} fill={'#66b2b2'} />}
        actionButtonOnPress={onActionButtonPress}
        actionButtonTitle="Learn more"
      >
        <Pressable
          style={styles.bottomButton}
          onPress={() => console.log('Cool feature!')}
        >
          <Text style={styles.buttonText}>Tip me</Text>
        </Pressable>
      </TipKitPopOverView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  inline: {
    backgroundColor: '#d7eef3',
  },
  tipContainer: {
    backgroundColor: '#f1f4f2',
  },
  customPopoverButton: {
    width: '60%',
    backgroundColor: '#66D210',
    padding: 12,
    borderRadius: 8,
  },
  customPopoverButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  topButton: {
    width: '30%',
    backgroundColor: '#66D210',
    padding: 12,
    borderRadius: 8,
  },
  bottomButton: {
    width: 100,
    backgroundColor: '#66D210',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});
