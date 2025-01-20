import React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

type CloseIconProps = SvgProps;

const CloseIcon: React.FC<CloseIconProps> = ({ ...props }) => {
  return (
    <Svg viewBox="0 0 24 24" width="18px" height="18px" {...props}>
      <Path d="M4.99 3.99a1 1 0 00-.697 1.717L10.586 12l-6.293 6.293a1 1 0 101.414 1.414L12 13.414l6.293 6.293a1 1 0 101.414-1.414L13.414 12l6.293-6.293a1 1 0 00-.727-1.717 1 1 0 00-.687.303L12 10.586 5.707 4.293a1 1 0 00-.717-.303z" />
    </Svg>
  );
};

export default CloseIcon;
