import { Palette } from 'lucide-react-native';
import { type FC } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  TipInvalidationReason,
  useTipKit,
} from '../../src/context/TipKitContext';

export const TIP_ID = 'create-new-palette';

type Props = {
  tipKitPopOverViewRef: React.MutableRefObject<null>;
};

const CreateButton: FC<Props> = ({ tipKitPopOverViewRef }) => {
  const { invalidateTip } = useTipKit();

  const handlePressCreateNewPalette = () => {
    // Handle create new palette
    invalidateTip({
      id: TIP_ID,
      invalidationReason: TipInvalidationReason.ACTION_PERFORMED,
    });
  };

  return (
    <View style={styles.bottomButtonContainer}>
      <Pressable
        ref={tipKitPopOverViewRef}
        style={styles.bottomButton}
        onPress={handlePressCreateNewPalette}
      >
        <View style={styles.bottomButtomTextWrapper}>
          <Palette size={24} color="#636366" />
          <Text style={styles.buttonText}>Create</Text>
        </View>
      </Pressable>
    </View>
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
