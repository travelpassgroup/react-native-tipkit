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
import { useRef } from 'react';
import { Palette, Plus, SwatchBook } from 'lucide-react-native';

export default function App() {
  const topPlusButtonRef = useRef(null);
  const bottomPlusButtonRef = useRef(null);

  const onActionButtonPress = () => {
    console.log('Action button pressed');
  };

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
            <Plus size={24} color="#636366" />
          </Pressable>
        </View>
        <Animated.View layout={LinearTransition} style={styles.container}>
          <TipKitInlineView
            title="Set favorites"
            description="Tap and hold a color to add it to your favorites"
            tipContainerStyle={styles.inline}
          />

          <View style={styles.bottomButtonContainer}>
            <Pressable
              ref={bottomPlusButtonRef}
              style={styles.bottomButton}
              onPress={() => console.log('Cool feature!')}
            >
              <View style={styles.bottomButtomTextWrapper}>
                <Palette size={24} color="#636366" />
                <Text style={styles.buttonText}>Create</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
      <TipKitPopOverView
        targetRef={topPlusButtonRef}
        title="Add New Color"
        description="Tap here to add a new color to the palette"
        tipContainerStyle={styles.tipContainer}
        icon={<DonutIcon height={40} width={40} />}
        actionButtonOnPress={onActionButtonPress}
      />
      <TipKitPopOverView
        targetRef={bottomPlusButtonRef}
        title="Create New Palette"
        description="Tap here to create a new palette of colors"
        tipContainerStyle={styles.tipContainer}
        icon={<SwatchBook size={36} color="#636366" />}
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
    justifyContent: 'space-between',
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
    backgroundColor: '#F0F6F7',
    borderRadius: 100,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 2px 12px',
  },
  bottomButton: {
    backgroundColor: '#F0F6F7',
    borderRadius: 100,
    height: 50,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 2px 12px',
  },
  buttonText: {
    color: '#636366',
    fontWeight: 'bold',
  },
  bottomButtonContainer: {
    bottom: 24,
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
  },
  bottomButtomTextWrapper: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
