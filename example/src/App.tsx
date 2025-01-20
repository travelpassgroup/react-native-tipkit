import { View, StyleSheet, Pressable, Text } from 'react-native';
import { TipKitInlineView, TipKitPopOverView } from 'react-native-tipkit';
import CloseIcon from './CloseIcon';

export default function App() {
  const onActionButtonPress = () => {
    console.log('Action button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TipKit Example</Text>
      <TipKitInlineView
        visible={true}
        tipContainer={styles.inline}
        title="Set favorites"
        description="Tap and hold a color to add it to your favorites"
      />

      <TipKitPopOverView
        // Tip Props
        title="Add New Color"
        description="Tap here to add a new color to the list"
        tipContainer={styles.tipContainer}
        leftIcon={<CloseIcon height={40} width={40} />}
        actionButtonOnPress={onActionButtonPress}
        // Popover Button Props
        popoverButtonProps={{ title: 'Show Popover Top' }}
        popoverButtonArrowDirection="top"
      />

      <TipKitPopOverView
        // Tip Props
        title="Add New Color"
        description="Tap here to add a new color to the list"
        tipContainer={styles.tipContainer}
        leftIcon={<CloseIcon height={40} width={40} />}
        actionButtonOnPress={onActionButtonPress}
        // Popover Button Props
        popoverButtonProps={{ title: 'Show Popover Bottom' }}
        popoverButtonArrowDirection="bottom"
      />

      {/* TODO: Fix the positioning of the arrow when the button is smaller than 100% */}
      <TipKitPopOverView
        // Tip Props
        title="Add New Color"
        description="Tap here to add a new color to the list"
        tipContainer={styles.tipContainer}
        leftIcon={<CloseIcon height={40} width={40} />}
        actionButtonOnPress={onActionButtonPress}
        popoverButtonArrowDirection="bottom-end"
        // Popover Button Props
        popoverButton={
          <Pressable style={styles.customPopoverButton} onPress={() => {}}>
            <Text style={styles.customPopoverButtonText}>
              Custom Popover button
            </Text>
          </Pressable>
        }
      />
    </View>
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
});
