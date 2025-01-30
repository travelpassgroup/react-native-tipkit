import React, { useEffect, type FC } from 'react';
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
import {
  TipInvalidationReason,
  TipStatus,
  useTipKit,
  type TipKit,
  type TipKitOptions,
  type TipKitRule,
} from '../context/TipKitContext';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../services/mmkv';

export interface BaseTipKitProps {
  type: 'inline' | 'popover';
  // General Logic Props
  id: string;
  options: TipKitOptions;
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
  tipContainerStyle?: ViewStyle;
  targetPosition?: LayoutMeasure;
  // Animation Props
  enteringAnimation?: any;
  exitingAnimation?: any;
  // Rule Props
  rule?: TipKitRule;
}

const ARROW_WIDTH = 26;

const BaseTipKit: FC<BaseTipKitProps> = ({
  id,
  type,
  title,
  titleStyle,
  description,
  descriptionStyle,
  icon,
  actionButtonTitle,
  actionButtonStyle,
  actionButtonOnPress,
  tipContainerStyle,
  targetPosition,
  enteringAnimation = FadeIn,
  exitingAnimation = FadeOut,
  options,
  rule,
}) => {
  const {
    registerTip,
    increaseMaxDisplayCount,
    invalidateTip,
    resetDatastore,
  } = useTipKit();
  const [tip] = useMMKVObject<TipKit>(id, storage);
  const { height: screenHeight } = Dimensions.get('screen');
  const canShowTip = tip?.shouldDisplay && tip?.status === TipStatus.AVAILABLE;

  useEffect(() => {
    resetDatastore();
  }, [resetDatastore]);

  const onPressClose = () => {
    if (tip) {
      invalidateTip({
        id,
        invalidationReason: TipInvalidationReason.TIP_CLOSED,
      });
    }
  };

  const arrowStyle = () => {
    if (!targetPosition) {
      return {};
    }
    const { pageY, pageX, width } = targetPosition;
    const isTop = pageY < screenHeight / 2;

    return {
      top: isTop ? -8 : undefined,
      left: pageX + width / 2 - ARROW_WIDTH - 4,
      bottom: isTop ? undefined : -7,
      backgroundColor: tipContainerStyle?.backgroundColor,
    };
  };

  useEffect(() => {
    registerTip(id, options, rule);
  }, [id, options, registerTip, rule]);

  useEffect(() => {
    if (canShowTip) {
      increaseMaxDisplayCount(id);
    }
  }, [id, increaseMaxDisplayCount, canShowTip]);

  return (
    canShowTip && (
      <Animated.View
        key={`tip-${title}`}
        entering={enteringAnimation}
        exiting={exitingAnimation}
      >
        {type === 'popover' && (
          <View style={[styles.arrow, { ...arrowStyle() }]} />
        )}

        <View style={[styles.container, tipContainerStyle]}>
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
