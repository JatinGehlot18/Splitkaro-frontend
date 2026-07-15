import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View } from 'react-native';

/**
 * A tiny JS-only stack navigator. Avoids native navigation deps so the app
 * runs in Metro with no extra pod/gradle linking. Enough for this demo:
 * push/replace/reset + goBack, with per-screen params.
 */

export type RouteName =
  | 'Login'
  | 'ProfileSetup'
  | 'Groups'
  | 'Friends'
  | 'Activity'
  | 'Account'
  | 'ScanCode'
  | 'GroupDetail'
  | 'CreateGroup'
  | 'AddExpense'
  | 'SplitUneven'
  | 'ExpenseDetail'
  | 'SettleUp'
  | 'Search'
  | 'ScanReceipt'
  | 'ScanReview';

/** Top-level sections that show the persistent bottom tab bar. */
export const TAB_ROUTES: RouteName[] = ['Groups', 'Friends', 'Activity', 'Account'];

export type Route = { name: RouteName; params?: Record<string, any> };

type NavContextValue = {
  push: (name: RouteName, params?: Record<string, any>) => void;
  replace: (name: RouteName, params?: Record<string, any>) => void;
  reset: (name: RouteName, params?: Record<string, any>) => void;
  goBack: () => void;
  canGoBack: boolean;
};

const NavContext = createContext<NavContextValue | null>(null);
const RouteContext = createContext<Route>({ name: 'Login' });

/**
 * Module-level escape hatch so code outside the component tree (the auth
 * client's session-expired handler) can redirect to Login without needing
 * navigation prop-drilled through AuthContext, which sits above the
 * navigator in App.tsx.
 */
let navActions: NavContextValue | null = null;
export function getNavActions(): NavContextValue | null {
  return navActions;
}

export function NavigatorProvider({
  initial,
  screens,
  tabBar,
}: {
  initial: Route;
  screens: Record<RouteName, React.ComponentType>;
  tabBar?: React.ReactNode;
}) {
  const [stack, setStack] = useState<Route[]>([initial]);

  const push = useCallback((name: RouteName, params?: Record<string, any>) => {
    setStack(s => [...s, { name, params }]);
  }, []);
  const replace = useCallback(
    (name: RouteName, params?: Record<string, any>) => {
      setStack(s => [...s.slice(0, -1), { name, params }]);
    },
    [],
  );
  const reset = useCallback((name: RouteName, params?: Record<string, any>) => {
    setStack([{ name, params }]);
  }, []);
  const goBack = useCallback(() => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const current = stack[stack.length - 1];
  const Screen = screens[current.name];

  const value = useMemo<NavContextValue>(
    () => ({ push, replace, reset, goBack, canGoBack: stack.length > 1 }),
    [push, replace, reset, goBack, stack.length],
  );

  useEffect(() => {
    navActions = value;
  }, [value]);

  return (
    <NavContext.Provider value={value}>
      <RouteContext.Provider value={current}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Screen />
          </View>
          {tabBar}
        </View>
      </RouteContext.Provider>
    </NavContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNavigation must be used inside NavigatorProvider');
  return ctx;
}

export function useRoute<T = Record<string, any>>() {
  const route = useContext(RouteContext);
  return { name: route.name, params: (route.params || {}) as T };
}
