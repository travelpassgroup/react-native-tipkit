import React, { useMemo, type FC } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type FlexAlignType,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import CloseIcon from './CloseIcon';
import type { TipKitPopOverArrowDirection } from '../TipKitPopOverView/TipKitPopOverView';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export interface BaseTipKitProps {
  // General Logic Props
  visible?: boolean;
  onDismiss?: () => void;

  // Content Props
  title?: string;
  titleStyle?: TextStyle;
  description?: string;
  descriptionStyle?: TextStyle;
  popoverButtonArrowDirection?: TipKitPopOverArrowDirection;

  // Icon Props
  leftIcon?: React.ReactNode;

  // Button Props
  actionButtonTitle?: string;
  actionButtonStyle?: TextStyle;
  actionButtonOnPress?: () => void;

  // Styling Props
  tipContainer?: ViewStyle;
  enteringAnimation?: any;
  exitingAnimation?: any;
}

const BaseTipKit: FC<BaseTipKitProps> = ({
  visible,
  onDismiss,
  title,
  titleStyle,
  description,
  descriptionStyle,
  leftIcon,
  actionButtonTitle,
  actionButtonStyle,
  actionButtonOnPress,
  tipContainer,
  popoverButtonArrowDirection,
  enteringAnimation = FadeIn,
  exitingAnimation = FadeOut,
}) => {
  const onXPress = () => {
    onDismiss?.();
  };

  const arrowStyle = useMemo(() => {
    const isTop = popoverButtonArrowDirection?.includes('top');
    const isStart = popoverButtonArrowDirection?.includes('start');
    const alignSelf = (() => {
      switch (popoverButtonArrowDirection) {
        case 'top-start':
        case 'bottom-start':
          return 'flex-start';
        case 'top-end':
        case 'bottom-end':
          return 'flex-end';
        case 'top':
        case 'bottom':
          return 'center';
        default:
          return 'center';
      }
    })();

    return {
      top: isTop ? undefined : -7,
      bottom: isTop ? -7 : undefined,
      left: isStart ? 6 : undefined,
      right: isStart ? undefined : 6,
      alignSelf: alignSelf as FlexAlignType,
      backgroundColor: tipContainer?.backgroundColor,
    };
  }, [popoverButtonArrowDirection, tipContainer?.backgroundColor]);

  return (
    visible && (
      <Animated.View
        key={`tip-${title}`}
        entering={enteringAnimation}
        exiting={exitingAnimation}
      >
        {popoverButtonArrowDirection && (
          <View style={[styles.arrow, { ...arrowStyle }]} />
        )}
        <View style={[styles.container, tipContainer]}>
          {leftIcon && leftIcon}
          <View style={[styles.wrapper]}>
            <View style={styles.header}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
              <Pressable onPress={onXPress}>
                <CloseIcon fill="#77848a" />
              </Pressable>
            </View>
            <Text style={[styles.description, descriptionStyle]}>
              {description}
            </Text>

            {actionButtonOnPress && actionButtonTitle && (
              <Pressable onPress={actionButtonOnPress}>
                <Text style={[styles.actionButton, actionButtonStyle]}>
                  {actionButtonTitle}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f1f4f2',
    flexDirection: 'row',
    gap: 10,
  },
  wrapper: {
    flex: 1,
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030607',
  },
  description: {
    fontSize: 14,
    color: '#6D6D72',
  },
  actionButton: {
    borderTopColor: '#D1D1D6',
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 10,

    fontSize: 16,
    color: '#007AFF',
  },
  arrow: {
    height: 20,
    width: 20,
    position: 'absolute',
    top: -7,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
});

export default BaseTipKit;
