import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from 'react';
import { storage } from '../services/mmkv';

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
  options: TipKitOptions;
  rule: TipKitRule;
};

type TipKitContextType = {
  invalidateTip: (id: string) => void;
  registerTip: (id: string, tipKitOptions: TipKitOptions) => void;
};

export const TipKitContext = createContext<TipKitContextType | null>(null);

export const TipKitProvider: FC<PropsWithChildren> = ({ children }) => {
  const invalidateTip = (id: string) => {
    console.log('invalidateTip', id);
    // invalidate the tip
    // setOptions and update storage
  };

  const registerTip = (id: string, tipKitOptions: TipKitOptions) => {
    console.log('registerTip', id);
    console.log('registerTip', tipKitOptions);
    storage.set(
      id,
      JSON.stringify({
        id,
        shouldDisplay: true,
        options: tipKitOptions,
        rule: {
          ruleName: {
            eventCount: 0,
          },
        },
      })
    );
    // register the tip
    // setOptions and update storage
  };

  return (
    <TipKitContext.Provider
      value={{
        registerTip,
        invalidateTip,
      }}
    >
      {children}
    </TipKitContext.Provider>
  );
};

export const useTipKit = () => useContext(TipKitContext) as TipKitContextType;
