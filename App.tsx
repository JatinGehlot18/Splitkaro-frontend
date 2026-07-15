/**
 * Splitkaro — split shared expenses with flatmates & friends.
 *
 * Screens are driven by a tiny JS stack navigator (src/nav). All data and auth
 * come from the mock API server in /server (static JSON responses).
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/auth/AuthContext';
import { NavigatorProvider, RouteName } from './src/nav/navigation';
import { TabBar } from './src/nav/TabBar';
import { ThemeProvider } from './src/theme/ThemeContext';

import LoginScreen from './src/screens/LoginScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import GroupsScreen from './src/screens/GroupsScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import AccountScreen from './src/screens/AccountScreen';
import ScanCodeScreen from './src/screens/ScanCodeScreen';
import GroupDetailScreen from './src/screens/GroupDetailScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import SplitUnevenScreen from './src/screens/SplitUnevenScreen';
import ExpenseDetailScreen from './src/screens/ExpenseDetailScreen';
import SettleUpScreen from './src/screens/SettleUpScreen';
import SearchScreen from './src/screens/SearchScreen';
import ScanReceiptScreen from './src/screens/ScanReceiptScreen';
import ScanReviewScreen from './src/screens/ScanReviewScreen';

const screens: Record<RouteName, React.ComponentType> = {
  Login: LoginScreen,
  ProfileSetup: ProfileSetupScreen,
  Groups: GroupsScreen,
  Friends: FriendsScreen,
  Activity: ActivityScreen,
  Account: AccountScreen,
  ScanCode: ScanCodeScreen,
  GroupDetail: GroupDetailScreen,
  CreateGroup: CreateGroupScreen,
  AddExpense: AddExpenseScreen,
  SplitUneven: SplitUnevenScreen,
  ExpenseDetail: ExpenseDetailScreen,
  SettleUp: SettleUpScreen,
  Search: SearchScreen,
  ScanReceipt: ScanReceiptScreen,
  ScanReview: ScanReviewScreen,
};

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigatorProvider initial={{ name: 'Login' }} screens={screens} tabBar={<TabBar />} />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
