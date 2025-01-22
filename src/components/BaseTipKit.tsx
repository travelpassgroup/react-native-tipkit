import React, { useCallback, useMemo, type FC } from 'react';
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
  buttonPosition?: LayoutMeasure;
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
  buttonPosition,
  enteringAnimation = FadeIn,
  exitingAnimation = FadeOut,
}) => {
  const { height: screenHeight } = Dimensions.get('screen');
  const onXPress = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const arrowStyle = useMemo(() => {
    if (!buttonPosition) {
      return {};
    }
    const { x, width, pageY } = buttonPosition;
    const isTop = pageY < screenHeight / 2;

    return {
      top: isTop ? -8 : undefined,
      left: x + width / 2 - ARROW_WIDTH / 2,
      bottom: isTop ? undefined : -7,
      backgroundColor: tipContainer?.backgroundColor,
    };
  }, [tipContainer?.backgroundColor, buttonPosition, screenHeight]);

  return (
    visible && (
      <Animated.View
        key={`tip-${title}`}
        entering={enteringAnimation
          .delay(500)
          .springify()
          .damping(15)
          .stiffness(200)}
        exiting={exitingAnimation}
      >
        {type === 'popover' && (
          <View style={[styles.arrow, { ...arrowStyle }]} />
        )}

        <View style={[styles.container, tipContainer]}>
          {icon && icon}
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
