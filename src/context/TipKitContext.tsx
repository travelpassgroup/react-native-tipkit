import {
  createContext,
  useContext,
  useEffect,
  type FC,
  type PropsWithChildren,
} from 'react';
import { storage } from '../services/mmkv';

export enum InvalidationReason {
  ACTION_PERFORMED = 'actionPerformed', // The user performed the action that the tip describes.
  DISPLAY_COUNT_EXCEEDED = 'displayCountExceeded', // The tip exceeded its maximum display count.
  DISPLAY_DURATION_EXCEEDED = 'displayDurationExceeded', // The tip exceeded its max display duration.
  TIP_CLOSED = 'tipClosed', // The user explicitly closed the tip view while it was displaying.
}

export enum Status {
  AVAILABLE = 'available', // The tip is eligible for display.
  INVALIDATED = 'invalidated', // The tip is no longer valid.
  PENDING = 'pending', // The tip is not eligible for display.
}

export type TipKitOptions = {
  maxDisplayCount: number;
};

export type TipKitRule = {
  ruleName: {
    eventCount: number;
  };
};

export type TipKit = {
  id: string;
  shouldDisplay: boolean;
  status?: Status;
  invalidationReason?: InvalidationReason; // Only if status is INVALIDATED
  created_at: string;
  updated_at: string;
  options: TipKitOptions;
  rule: TipKitRule;
};

type InvalidateTipProps = {
  id: string;
  invalidationReason: InvalidationReason;
};

type TipKitContextType = {
  invalidateTip: ({ id, invalidationReason }: InvalidateTipProps) => void;
  registerTip: (id: string, tipKitOptions: TipKitOptions) => void;
  increaseEventCount: (id: string) => void;
  resetDatastore: () => void;
  clearDataStorage: () => void;
};

export const TipKitContext = createContext<TipKitContextType | null>(null);

export const TipKitProvider: FC<PropsWithChildren> = ({ children }) => {
  const invalidateTip = ({ id, invalidationReason }: InvalidateTipProps) => {
    const tip = storage.getString(id);
    if (tip) {
      const parsedTip = JSON.parse(tip);
      const updatedTip = {
        ...parsedTip,
        shouldDisplay: false,
        status: Status.INVALIDATED,
        invalidationReason,
        updated_at: new Date().toISOString(),
      };
      storage.set(id, JSON.stringify(updatedTip));
    }
  };

  const clearDataStorage = () => {
    storage.clearAll();
  };

  const getAllTips = () => {
    const keys = storage.getAllKeys();
    console.log(keys);
  };

  useEffect(() => {
    getAllTips();
  }, []);

  const registerTip = (id: string, tipKitOptions: TipKitOptions) => {
    const hasTipRegistered = storage.contains(id);
    if (!hasTipRegistered) {
      storage.set(
        id,
        JSON.stringify({
          id,
          created_at: new Date().toISOString(),
          shouldDisplay: true,
          options: tipKitOptions,
          rule: {
            ruleName: {
              eventCount: 0,
            },
          },
        })
      );
    }
  };

  const increaseEventCount = (id: string) => {
    const tip = storage.getString(id);
    if (tip) {
      const parsedTip = JSON.parse(tip);
      const eventCount = parsedTip.rule.ruleName.eventCount + 1;
      const shouldDisplay = eventCount <= parsedTip.options.maxDisplayCount;
      const updatedTip = {
        ...parsedTip,
        shouldDisplay,
        rule: {
          ruleName: {
            eventCount,
          },
        },
        updated_at: new Date().toISOString(),
      };

      if (!shouldDisplay) {
        invalidateTip({
          id,
          invalidationReason: InvalidationReason.DISPLAY_COUNT_EXCEEDED,
        });
      }

      storage.set(id, JSON.stringify(updatedTip));
    }
  };

  const resetDatastore = () => {
    // TODO: Implement this function
    // TODO: resetDatastore (reset all tips status again)
  };

  return (
    <TipKitContext.Provider
      value={{
        registerTip,
        invalidateTip,
        increaseEventCount,
        resetDatastore,
        clearDataStorage,
      }}
    >
      {children}
    </TipKitContext.Provider>
  );
};

export const useTipKit = () => useContext(TipKitContext) as TipKitContextType;
