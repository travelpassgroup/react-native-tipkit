import React, {
  Fragment,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';
import { Dimensions, StyleSheet, type LayoutRectangle } from 'react-native';
import Animated, {
  LinearTransition,
  ZoomInEasyDown,
  ZoomOutEasyDown,
} from 'react-native-reanimated';

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
  const [buttonPosition, setButtonPosition] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const popoverStyle = useMemo(() => {
    const { y, height } = buttonPosition;
    const isTop = y < screenHeight / 2;

    return {
      top: y + (isTop ? height * 1.5 : -height * 2),
    };
  }, [buttonPosition]);

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <Fragment>
      <Animated.View
        layout={LinearTransition}
        style={styles.buttonContainer}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setButtonPosition({ x, y, width, height });
        }}
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
            buttonPosition={buttonPosition}
            enteringAnimation={ZoomInEasyDown}
            exitingAnimation={ZoomOutEasyDown}
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
