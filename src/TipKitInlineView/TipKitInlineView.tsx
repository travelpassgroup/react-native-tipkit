import React, { useCallback } from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';
import { StretchInY, StretchOutY } from 'react-native-reanimated';

interface TipKitInlineViewProps extends BaseTipKitProps {}

const TipKitInlineView: React.FC<TipKitInlineViewProps> = ({ ...rest }) => {
  const [visible, setVisible] = React.useState(true);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <BaseTipKit
      popoverButtonArrowDirection={undefined}
      enteringAnimation={StretchInY}
      exitingAnimation={StretchOutY}
      visible={visible}
      onDismiss={onDismiss}
      {...rest}
    />
  );
};

export default TipKitInlineView;
