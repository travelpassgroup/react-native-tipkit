import {
  StyleSheet,
  Pressable,
  Text,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import { TipKitInlineView, TipKitPopOverView } from 'react-native-tipkit';
import DonutIcon from './DonutIcon';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useCallback, useRef } from 'react';

export default function App() {
  const topPlusButtonRef = useRef(null);
  const bottomPlusButtonRef = useRef(null);

  const onActionButtonPress = useCallback(() => {
    console.log('Action button pressed');
  }, []);

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.titleContainer}>
          <Animated.Text layout={LinearTransition} style={styles.title}>
            TipKit Example
          </Animated.Text>
          <Pressable
            ref={topPlusButtonRef}
            style={styles.topButton}
            onPress={() => console.log('Cool feature!')}
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
        <Animated.View layout={LinearTransition} style={styles.container}>
          <TipKitInlineView
            title="Set favorites"
            description="Tap and hold a color to add it to your favorites"
            tipContainer={styles.inline}
          />

          <View style={styles.buttonContainer}>
            <Pressable
              ref={bottomPlusButtonRef}
              style={styles.bottomButton}
              onPress={() => console.log('Cool feature!')}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
      <TipKitPopOverView
        targetRef={topPlusButtonRef}
        title="Add New Color"
        description="Tap here to add a new color to the list"
        tipContainer={styles.tipContainer}
        icon={<DonutIcon height={40} width={40} />}
        actionButtonOnPress={onActionButtonPress}
      />
      <TipKitPopOverView
        targetRef={bottomPlusButtonRef}
        title="Add New Color"
        description="Tap here to add a new color to the list"
        tipContainer={styles.tipContainer}
        icon={<DonutIcon height={40} width={40} fill={'#66b2b2'} />}
        actionButtonOnPress={onActionButtonPress}
        actionButtonTitle="Learn more"
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    marginTop: Platform.select({ ios: 0, android: 24 }),
  },
  container: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 120,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  inline: {
    backgroundColor: '#d7eef3',
  },
  tipContainer: {
    backgroundColor: '#f1f4f2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  topButton: {
    backgroundColor: '#66D210',
    borderRadius: 100,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    backgroundColor: '#66D210',
    borderRadius: 100,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    left: 50,
  },
  buttonText: {
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 24,
  },
});
