import {
  StyleSheet,
  Pressable,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import DonutIcon from './DonutIcon';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useRef } from 'react';
import { Plus, SwatchBook } from 'lucide-react-native';
import CreateButton from './CreateButton';
import ResetButton from './ResetButton';
import {
  TipKitInlineView,
  TipKitPopOverView,
  TipKitProvider,
} from '@travelpass/react-native-tipkit';

export default function App() {
  const topPlusButtonRef = useRef(null);
  const bottomPlusButtonRef = useRef(null);
  const bottomResetButtonRef = useRef(null);

  const onActionButtonPress = () => {
    console.log('Action button pressed');
  };

  return (
    <TipKitProvider>
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
            id="set-favorites"
            title="Set favorites"
            description="Tap and hold a color to add it to your favorites"
            tipContainerStyle={styles.inline}
            options={{
              maxDisplayCount: 3,
            }}
          />
        </Animated.View>
        <CreateButton tipKitPopOverViewRef={bottomPlusButtonRef} />
        <ResetButton tipKitPopOverViewRef={bottomResetButtonRef} />
      </SafeAreaView>
      <TipKitPopOverView
        id="add-new-color"
        targetRef={topPlusButtonRef}
        title="Add New Color"
        description="Tap here to add a new color to the palette"
        tipContainerStyle={styles.tipContainer}
        icon={<DonutIcon height={40} width={40} />}
        actionButtonOnPress={onActionButtonPress}
        options={{
          maxDisplayCount: 2,
        }}
      />
      <TipKitPopOverView
        id="create-new-palette"
        targetRef={bottomPlusButtonRef}
        title="Create New Palette"
        description="Tap here to create a new palette of colors"
        tipContainerStyle={styles.tipContainer}
        icon={<SwatchBook size={36} color="#636366" />}
        actionButtonOnPress={onActionButtonPress}
        actionButtonTitle="Learn more"
        options={{
          maxDisplayCount: 4,
        }}
        rule={{
          ruleName: 'hasNotExistingPalettes',
          evaluate: () => {
            const palettes = [];
            return palettes.length === 0;
          },
        }}
      />
    </TipKitProvider>
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

  buttonText: {
    color: '#636366',
    fontWeight: 'bold',
  },
});
