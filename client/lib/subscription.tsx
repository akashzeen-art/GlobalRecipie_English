import { createContext, useContext, ReactNode } from "react";

interface SubscriptionContextType {}

const SubscriptionContext = createContext<SubscriptionContextType>({});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => (
  <SubscriptionContext.Provider value={{}}>
    {children}
  </SubscriptionContext.Provider>
);
