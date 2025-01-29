import {
  createContext,
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
  ruleName: {
    eventCount: number;
  };
};

export type TipKit = {
  id: string;
  shouldDisplay: boolean;
  status?: TipStatus;
  invalidationReason?: TipInvalidationReason; // Only if status is INVALIDATED
  created_at: string;
  updated_at: string;
  options: TipKitOptions;
  rule: TipKitRule;
};

type InvalidateTipProps = {
  id: string;
  invalidationReason: TipInvalidationReason;
};

type TipKitContextType = {
  invalidateTip: ({ id, invalidationReason }: InvalidateTipProps) => void;
  registerTip: (id: string, tipKitOptions: TipKitOptions) => void;
  increaseMaxDisplayCount: (id: string) => void;
  getAllTipsIds: () => string[];
  resetDatastore: () => void;
  cleanDatastore: () => void;
};

export const TipKitContext = createContext<TipKitContextType | null>(null);

export const TipKitProvider: FC<PropsWithChildren> = ({ children }) => {
  const cleanDatastore = () => {
    storage.clearAll();
  };

  const getAllTipsIds = () => {
    return storage.getAllKeys();
  };

  const registerTip = (id: string, tipKitOptions: TipKitOptions) => {
    const hasTipRegistered = storage.contains(id);
    if (!hasTipRegistered) {
      storage.set(
        id,
        JSON.stringify({
          id,
          created_at: new Date().toISOString(),
          shouldDisplay: true,
          options: {
            maxDisplayCount: {
              value: tipKitOptions.maxDisplayCount,
              count: 0,
            },
          },
          rule: {
            ruleName: {
              eventCount: 0,
            },
          },
        })
      );
    }
  };

  const invalidateTip = ({ id, invalidationReason }: InvalidateTipProps) => {
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
  };

  const increaseMaxDisplayCount = (id: string) => {
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
  };

  const resetDatastore = () => {
    storage.getAllKeys().map((key) => {
      const tip = storage.getString(key);
      if (tip) {
        const parsedTip = JSON.parse(tip);
        const updatedTip = {
          ...parsedTip,
          shouldDisplay: true,
          status: TipStatus.AVAILABLE,
          invalidationReason: undefined,
          rule: {
            ruleName: {
              eventCount: 0,
            },
          },
          updated_at: new Date().toISOString(),
        };
        storage.set(key, JSON.stringify(updatedTip));
      }
    });
  };

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

export const useTipKit = () => useContext(TipKitContext) as TipKitContextType;
