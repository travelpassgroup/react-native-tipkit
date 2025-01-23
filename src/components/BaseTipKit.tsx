import React, { type FC } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import CloseIcon from './CloseIcon';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { LayoutMeasure } from '../TipKitPopOverView/TipKitPopOverView';

export interface BaseTipKitProps {
  type?: 'inline' | 'popover';
  // General Logic Props
  visible?: boolean;
  onDismiss?: () => void;
  // Content Props
  title?: string;
  titleStyle?: TextStyle;
  description?: string;
  descriptionStyle?: TextStyle;
  // Icon Props
  icon?: React.ReactNode;
  // Action Button Props
  actionButtonTitle?: string;
  actionButtonStyle?: TextStyle;
  actionButtonOnPress?: () => void;
  // Styling Props
  tipContainer?: ViewStyle;
  targetPosition?: LayoutMeasure;
  // Animation Props
  enteringAnimation?: any;
  exitingAnimation?: any;
}

const ARROW_WIDTH = 26;

const BaseTipKit: FC<BaseTipKitProps> = ({
  type,
  visible,
  onDismiss,
  title,
  titleStyle,
  description,
  descriptionStyle,
  icon,
  actionButtonTitle,
  actionButtonStyle,
  actionButtonOnPress,
  tipContainer,
  targetPosition,
  enteringAnimation = FadeIn,
  exitingAnimation = FadeOut,
}) => {
  const { height: screenHeight } = Dimensions.get('screen');

  const onPressClose = () => {
    onDismiss?.();
  };

  const arrowStyle = () => {
    if (!targetPosition) {
      return {};
    }
    const { pageY, pageX } = targetPosition;
    const isTop = pageY < screenHeight / 2;

    return {
      top: isTop ? -8 : undefined,
      left: pageX - 6, // understand why 6
      bottom: isTop ? undefined : -7,
      backgroundColor: tipContainer?.backgroundColor,
    };
  };

  return (
    visible && (
      <Animated.View
        key={`tip-${title}`}
        entering={enteringAnimation}
        exiting={exitingAnimation}
      >
        {type === 'popover' && (
          <View style={[styles.arrow, { ...arrowStyle() }]} />
        )}

        <View style={[styles.container, tipContainer]}>
          {icon && icon}
          <View style={[styles.wrapper]}>
            <View style={styles.header}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
              <Pressable onPress={onPressClose}>
                <CloseIcon fill="#77848a" />
              </Pressable>
            </View>
            <Text style={[styles.description, descriptionStyle]}>
              {description}
            </Text>

            {actionButtonOnPress && !!actionButtonTitle && (
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
    width: ARROW_WIDTH,
    height: ARROW_WIDTH,
    position: 'absolute',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
});

export default BaseTipKit;
