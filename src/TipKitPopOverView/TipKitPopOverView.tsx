import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';
import {
  Dimensions,
  StyleSheet,
  type LayoutChangeEvent,
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
    'type' | 'visible' | 'onDismiss' | 'buttonPosition'
  > {}

const { height: screenHeight } = Dimensions.get('screen');

const TipKitPopOverView: React.FC<
  PropsWithChildren<TipKitPopOverViewProps>
> = ({ children, ...rest }) => {
  const [visible, setVisible] = useState(true);
  const [targetPosition, setTargetPosition] = useState<LayoutMeasure>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });

  const popoverStyle = useMemo(() => {
    const { y, height, pageY } = targetPosition;
    const isTop = pageY < screenHeight / 2;

    return {
      top: y + (isTop ? height * 1.5 : -height * 2.6),
    };
  }, [targetPosition]);

  const onDismiss = () => {
    setVisible(false);
  };

  const handleOnLayout = useCallback((event: LayoutChangeEvent) => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setTargetPosition({ x, y, width, height, pageX, pageY });
    });
  }, []);

  return (
    <Fragment>
      <Animated.View
        layout={LinearTransition}
        style={styles.buttonContainer}
        onLayout={handleOnLayout}
      >
        {children}
      </Animated.View>
      {visible && (
        <Animated.View
          layout={LinearTransition}
          style={[styles.popoverContainer, popoverStyle]}
        >
          <BaseTipKit
            type="popover"
            visible={true}
            onDismiss={onDismiss}
            targetPosition={targetPosition}
            enteringAnimation={ZoomIn.delay(500)
              .springify()
              .damping(15)
              .stiffness(200)}
            exitingAnimation={ZoomOut}
            {...rest}
          />
        </Animated.View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  popoverContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 9999,
    width: '100%',
  },
  buttonContainer: {
    zIndex: 9998,
    alignSelf: 'flex-start',
  },
});

export default TipKitPopOverView;
