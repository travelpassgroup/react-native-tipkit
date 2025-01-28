import React from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';
import { StretchInY, StretchOutY } from 'react-native-reanimated';

interface TipKitInlineViewProps
  extends Omit<
    BaseTipKitProps,
    'type' | 'visible' | 'onDismiss' | 'buttonPosition'
  > {}

const TipKitInlineView: React.FC<TipKitInlineViewProps> = ({ ...rest }) => {
  return (
    <BaseTipKit
      type="inline"
      enteringAnimation={StretchInY}
      exitingAnimation={StretchOutY}
      {...rest}
    />
  );
};

export default TipKitInlineView;
