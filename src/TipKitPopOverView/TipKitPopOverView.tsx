import React, {
  Fragment,
  useMemo,
  useRef,
  useState,
  type JSXElementConstructor,
  type ReactElement,
} from 'react';
import BaseTipKit, { type BaseTipKitProps } from '../components/BaseTipKit';
import { Button, StyleSheet, View, type ButtonProps } from 'react-native';

export type TipKitPopOverArrowDirection =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end';

interface TipKitPopOverViewProps extends BaseTipKitProps {
  popoverButtonArrowDirection?: TipKitPopOverArrowDirection;
  popoverButton?: ReactElement<any, string | JSXElementConstructor<any>>;
  popoverButtonOnPress?: () => void;
  popoverButtonTitle?: string;
  popoverButtonProps?: ButtonProps;
}

const TipKitPopOverView: React.FC<TipKitPopOverViewProps> = ({
  popoverButton,
  popoverButtonOnPress,
  popoverButtonProps,
  popoverButtonArrowDirection = 'bottom',
  ...rest
}) => {
  const buttonRef = useRef<View>(null);

  const [visible, setVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const measureButtonPosition = () => {
    buttonRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setButtonPosition({ x: px, y: py, width, height });
    });
  };

  const popoverStyle = useMemo(() => {
    const { y, x, height } = buttonPosition;
    const isTop = popoverButtonArrowDirection?.includes('top');

    return {
      top: y + (isTop ? -height * 2.5 : height * 1.5),
      left: x,
    };
  }, [buttonPosition, popoverButtonArrowDirection]);

  const onDismiss = () => {
    setVisible(false);
  };

  const handlePopoverButtonPress = () => {
    measureButtonPosition();
    popoverButtonOnPress?.();
    setVisible(true);
  };

  return (
    <Fragment>
      <View ref={buttonRef} style={styles.buttonContainer}>
        {popoverButton ? (
          React.cloneElement(popoverButton, {
            onPress: () => {
              handlePopoverButtonPress();
              popoverButton.props.onPress?.();
            },
          })
        ) : (
          <Button
            onPress={handlePopoverButtonPress}
            title={popoverButtonProps?.title || ''}
            color="#158481"
            {...popoverButtonProps}
          />
        )}
      </View>
      {visible && (
        <View style={[styles.popoverContainer, popoverStyle]}>
          <BaseTipKit
            visible={true}
            onDismiss={onDismiss}
            popoverButtonArrowDirection={popoverButtonArrowDirection}
            {...rest}
          />
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    zIndex: 9998,
  },
  popoverContainer: {
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
  },
});

export default TipKitPopOverView;
