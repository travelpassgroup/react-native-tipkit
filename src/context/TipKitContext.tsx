import {
  createContext,
  useCallback,
  useContext,
  type FC,
  type PropsWithChildren,
} from 'react';
import { storage } from '../services/mmkv';

export enum TipInvalidationReason {
  ACTION_PERFORMED = 'actionPerformed', // The user performed the action that the tip describes.
  DISPLAY_COUNT_EXCEEDED = 'displayCountExceeded', // The tip exceeded its maximum display count.
  DISPLAY_DURATION_EXCEEDED = 'displayDurationExceeded', // The tip exceeded its max display duration.
  TIP_CLOSED = 'tipClosed', // The user explicitly closed the tip view while it was displaying.
}

export enum TipStatus {
  AVAILABLE = 'available', // The tip is eligible for display.
  INVALIDATED = 'invalidated', // The tip is no longer valid.
  PENDING = 'pending', // The tip is not eligible for display.
}

export type TipKitOptions = {
  maxDisplayCount: number;
};

export type TipKitRule = {
  ruleName: string;
  evaluate: () => boolean;
};

export type TipKit = {
  id: string;
  shouldDisplay: boolean;
  status?: TipStatus;
  invalidationReason?: TipInvalidationReason; // Only if status is INVALIDATED
  created_at: string;
  updated_at: string;
  options: TipKitOptions;
  rule?: TipKitRule;
};

type InvalidateTipProps = {
  id: string;
  invalidationReason: TipInvalidationReason;
};

type TipKitContextType = {
  invalidateTip: ({ id, invalidationReason }: InvalidateTipProps) => void;
  registerTip: (
    id: string,
    tipKitOptions: TipKitOptions,
    rule?: TipKitRule
  ) => void;
  increaseMaxDisplayCount: (id: string) => void;
  getAllTipsIds: () => string[];
  resetDatastore: () => void;
  cleanDatastore: () => void;
};

export const TipKitContext = createContext<TipKitContextType | null>(null);

export const TipKitProvider: FC<PropsWithChildren> = ({ children }) => {
  const cleanDatastore = useCallback(() => {
    storage.clearAll();
  }, []);

  const getAllTipsIds = useCallback(() => {
    return storage.getAllKeys();
  }, []);

  const invalidateTip = useCallback(
    ({ id, invalidationReason }: InvalidateTipProps) => {
      const tip = storage.getString(id);
      if (tip) {
        const parsedTip = JSON.parse(tip);
        const updatedTip = {
          ...parsedTip,
          shouldDisplay: false,
          status: TipStatus.INVALIDATED,
          invalidationReason,
          updated_at: new Date().toISOString(),
        };
        storage.set(id, JSON.stringify(updatedTip));
      }
    },
    []
  );

  const changeTipStatus = useCallback(
    ({ id, status }: { id: string; status: TipStatus }) => {
      const tip = storage.getString(id);
      if (tip) {
        const parsedTip = JSON.parse(tip);
        const updatedTip = {
          ...parsedTip,
          status,
          updated_at: new Date().toISOString(),
        };
        storage.set(id, JSON.stringify(updatedTip));
      }
    },
    []
  );

  const evaluateRule = useCallback(
    (id: string, rule: TipKitRule) => {
      const tip = storage.getString(id);
      if (!tip) return;

      const parsedTip = JSON.parse(tip);
      if (!parsedTip.rule.ruleName) return;

      if (parsedTip.status === TipStatus.INVALIDATED) return;

      try {
        const isRuleValid = rule.evaluate();
        if (!isRuleValid) {
          changeTipStatus({
            id,
            status: TipStatus.PENDING,
          });
        } else {
          changeTipStatus({
            id,
            status: TipStatus.AVAILABLE,
          });
        }
      } catch (error) {
        console.error(`Error evaluating rule for tip ${id}:`, error);
        return;
      }
    },
    [changeTipStatus]
  );

  const registerTip = useCallback(
    (id: string, tipKitOptions: TipKitOptions, rule?: TipKitRule) => {
      const storedTip = storage.getString(id);
      let parsedTip = storedTip ? JSON.parse(storedTip) : null;
      let shouldUpdate = false;

      if (!parsedTip) {
        parsedTip = {
          id,
          created_at: new Date().toISOString(),
          shouldDisplay: true,
          status: TipStatus.AVAILABLE,
          options: {
            maxDisplayCount: {
              value: tipKitOptions.maxDisplayCount,
              count: 0,
            },
          },
          rule: rule ? { ruleName: rule.ruleName } : undefined,
        };
        shouldUpdate = true;
      } else {
        if (rule && parsedTip.rule?.ruleName !== rule.ruleName) {
          parsedTip.rule = rule;
          shouldUpdate = true;
        }

        if (
          tipKitOptions &&
          tipKitOptions.maxDisplayCount !==
            parsedTip.options.maxDisplayCount.value
        ) {
          parsedTip.options.maxDisplayCount.value =
            tipKitOptions.maxDisplayCount;
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        storage.set(id, JSON.stringify(parsedTip));
      }

      if (rule) {
        evaluateRule(id, rule);
      }
    },
    [evaluateRule]
  );

  const increaseMaxDisplayCount = useCallback(
    (id: string) => {
      const tip = storage.getString(id);
      if (tip) {
        const parsedTip = JSON.parse(tip);
        const eventCount = parsedTip.options.maxDisplayCount.count + 1;
        const shouldDisplay =
          eventCount <= parsedTip.options.maxDisplayCount.value;
        const updatedTip = {
          ...parsedTip,
          shouldDisplay,
          options: {
            maxDisplayCount: {
              value: parsedTip.options.maxDisplayCount.value,
              count: eventCount,
            },
          },
          updated_at: new Date().toISOString(),
        };

        if (!shouldDisplay) {
          invalidateTip({
            id,
            invalidationReason: TipInvalidationReason.DISPLAY_COUNT_EXCEEDED,
          });
        }

        storage.set(id, JSON.stringify(updatedTip));
      }
    },
    [invalidateTip]
  );

  const resetDatastore = useCallback(() => {
    storage.getAllKeys().map((key) => {
      const tip = storage.getString(key);
      if (tip) {
        const parsedTip = JSON.parse(tip);
        const updatedTip = {
          ...parsedTip,
          shouldDisplay: true,
          status: TipStatus.AVAILABLE,
          invalidationReason: undefined,
          options: {
            maxDisplayCount: {
              value: parsedTip.options.maxDisplayCount.value,
              count: 0,
            },
          },
          updated_at: new Date().toISOString(),
        };
        storage.set(key, JSON.stringify(updatedTip));
      }
    });
  }, []);

  return (
    <TipKitContext.Provider
      value={{
        registerTip,
        invalidateTip,
        increaseMaxDisplayCount,
        getAllTipsIds,
        resetDatastore,
        cleanDatastore,
      }}
    >
      {children}
    </TipKitContext.Provider>
  );
};

export const useTipKit = () => {
  const context = useContext(TipKitContext) as TipKitContextType;
  if (!context) {
    throw new Error('useTipKit must be used within a TipKitProvider');
  }
  return context;
};
