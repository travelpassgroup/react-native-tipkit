import { Palette, SwatchBook } from 'lucide-react-native';
import { useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { TipKitPopOverView } from 'react-native-tipkit';
import {
  TipInvalidationReason,
  useTipKit,
} from '../../src/context/TipKitContext';

const TIP_ID = 'create-new-palette';

const CreateButton = () => {
  const bottomPlusButtonRef = useRef(null);
  const { invalidateTip } = useTipKit();

  const onActionButtonPress = () => {
    console.log('Action button pressed');
  };

  const handlePressCreateNewPalette = () => {
    // Handle create new palette
    invalidateTip({
      id: TIP_ID,
      invalidationReason: TipInvalidationReason.ACTION_PERFORMED,
    });
  };

  const getPalettes = () => {
    return [];
  };
  return (
    <>
      <View style={styles.bottomButtonContainer}>
        <Pressable
          ref={bottomPlusButtonRef}
          style={styles.bottomButton}
          onPress={handlePressCreateNewPalette}
        >
          <View style={styles.bottomButtomTextWrapper}>
            <Palette size={24} color="#636366" />
            <Text style={styles.buttonText}>Create</Text>
          </View>
        </Pressable>
      </View>
      <TipKitPopOverView
        id={TIP_ID}
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
            const palettes = getPalettes();
            return palettes.length === 0;
          },
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  tipContainer: {
    backgroundColor: '#f1f4f2',
  },
  buttonText: {
    color: '#636366',
    fontWeight: 'bold',
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
});

export default CreateButton;
