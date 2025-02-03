import { RefreshCcw } from 'lucide-react-native';
import type { FC } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTipKit } from '../../src/context/TipKitContext';

type Props = {
  tipKitPopOverViewRef: React.MutableRefObject<null>;
};
const ResetButton: FC<Props> = ({ tipKitPopOverViewRef }) => {
  const { resetDatastore } = useTipKit();
  return (
    <View style={styles.bottomButtonContainer}>
      <Pressable
        ref={tipKitPopOverViewRef}
        style={styles.bottomButton}
        onPress={() => resetDatastore()}
      >
        <View style={styles.bottomButtomTextWrapper}>
          <RefreshCcw size={24} color="#FFF" />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomButtonContainer: {
    bottom: 32,
    right: 16,
    position: 'absolute',
  },
  bottomButton: {
    backgroundColor: '#EC4E20',
    borderRadius: 100,
    height: 50,
    width: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 2px 12px',
  },
  bottomButtomTextWrapper: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetButton;
