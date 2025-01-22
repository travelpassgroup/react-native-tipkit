import React from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';
import { StretchInY, StretchOutY } from 'react-native-reanimated';

interface TipKitInlineViewProps
  extends Omit<
    BaseTipKitProps,
    'type' | 'visible' | 'onDismiss' | 'buttonPosition'
  > {}

const TipKitInlineView: React.FC<TipKitInlineViewProps> = ({ ...rest }) => {
  const [visible, setVisible] = React.useState(true);

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <BaseTipKit
      type="inline"
      visible={visible}
      onDismiss={onDismiss}
      enteringAnimation={StretchInY}
      exitingAnimation={StretchOutY}
      {...rest}
    />
  );
};

export default TipKitInlineView;
