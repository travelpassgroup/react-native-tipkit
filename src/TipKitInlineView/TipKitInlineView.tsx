import React from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';

interface TipKitInlineViewProps extends BaseTipKitProps {}

const TipKitInlineView: React.FC<TipKitInlineViewProps> = ({ ...rest }) => {
  return <BaseTipKit popoverButtonArrowDirection={undefined} {...rest} />;
};

export default TipKitInlineView;
