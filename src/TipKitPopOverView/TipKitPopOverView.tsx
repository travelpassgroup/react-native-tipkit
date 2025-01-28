import React, { useEffect, useState } from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';
import {
  Dimensions,
  StyleSheet,
  View,
  type LayoutRectangle,
} from 'react-native';
import Animated, {
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

export interface LayoutMeasure extends LayoutRectangle {
  pageX: number;
  pageY: number;
}

interface TipKitPopOverViewProps
  extends Omit<
    BaseTipKitProps,
    'type' | 'visible' | 'onDismiss' | 'targetPosition'
  > {
  targetRef: React.RefObject<View>;
}

const TipKitPopOverView: React.FC<TipKitPopOverViewProps> = ({
  targetRef,
  ...rest
}) => {
  const [targetPosition, setTargetPosition] = useState<LayoutMeasure>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });
  const { height: screenHeight } = Dimensions.get('screen');

  useEffect(() => {
    const measureTarget = () => {
      targetRef?.current?.measure((x, y, width, height, pageX, pageY) => {
        setTargetPosition({ x, y, width, height, pageX, pageY });
      });
    };
    const timeout = setTimeout(measureTarget, 100);
    return () => clearTimeout(timeout);
  }, [targetRef]);

  useEffect(() => {
    if (targetRef.current == null) {
      throw new Error('Target ref is not defined');
    }
  }, [targetRef]);

  const popoverStyle = () => {
    const { height, pageY } = targetPosition;
    const isTargetOnTop = pageY < screenHeight / 2;

    return {
      top: pageY + (isTargetOnTop ? height * 1.5 : -height * 2.5),
    };
  };

  return (
    <Animated.View
      layout={LinearTransition}
      style={[styles.popoverContainer, popoverStyle()]}
    >
      <BaseTipKit
        type="popover"
        targetPosition={targetPosition}
        enteringAnimation={ZoomIn.delay(500)
          .springify()
          .damping(15)
          .stiffness(200)}
        exitingAnimation={ZoomOut}
        {...rest}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popoverContainer: {
    position: 'absolute',
    zIndex: 9999,
    right: 16,
    left: 16,
  },
});

export default TipKitPopOverView;
