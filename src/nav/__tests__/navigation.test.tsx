import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ReceiptScan } from '../../api/types';
import { ThemeProvider } from '../../theme/ThemeContext';
import { RootStackParamList, TabParamList, resetTo, useNavigation, useRoute } from '../navigation';
import { navigationRef } from '../navigationRef';
import { TabBar } from '../TabBar';

jest.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function GroupsTabScreen() {
  const [count, setCount] = useState(0);
  const nav = useNavigation();
  return (
    <>
      <Text testID="groups-count">{count}</Text>
      <TouchableOpacity testID="groups-increment" onPress={() => setCount(c => c + 1)}>
        <Text>increment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="groups-push-detail"
        onPress={() => nav.push('GroupDetail', { id: 'g1', name: 'Flat 3B' })}>
        <Text>open detail</Text>
      </TouchableOpacity>
    </>
  );
}

function PlainTabScreen() {
  return <Text>placeholder</Text>;
}

function GroupDetailScreen() {
  const { params } = useRoute<RootStackParamList['GroupDetail']>();
  const nav = useNavigation();
  const scan: ReceiptScan = {
    merchant: 'Cafe',
    amount: 420,
    category: 'Food',
    date: '2026-07-17',
    targetGroup: params.id,
  };
  return (
    <>
      <Text testID="detail-id">{params.id}</Text>
      <TouchableOpacity
        testID="detail-push-expense"
        onPress={() => nav.push('ExpenseDetail', { groupId: params.id, expenseId: 'e1' })}>
        <Text>open expense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="detail-push-scan-review"
        onPress={() => nav.push('ScanReview', { id: params.id, scan })}>
        <Text>open scan review</Text>
      </TouchableOpacity>
    </>
  );
}

function ExpenseDetailScreen() {
  const { params } = useRoute<RootStackParamList['ExpenseDetail']>();
  return <Text testID="expense-params">{`${params.groupId}:${params.expenseId}`}</Text>;
}

function ScanReviewScreen() {
  const { params } = useRoute<RootStackParamList['ScanReview']>();
  return <Text testID="scan-review-merchant">{params.scan.merchant}</Text>;
}

function LoginScreen() {
  return <Text testID="login-screen">login</Text>;
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Groups" component={GroupsTabScreen} />
      <Tab.Screen name="Friends" component={PlainTabScreen} />
      <Tab.Screen name="Activity" component={PlainTabScreen} />
      <Tab.Screen name="Account" component={PlainTabScreen} />
    </Tab.Navigator>
  );
}

function TestApp() {
  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
          <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
          <Stack.Screen name="ScanReview" component={ScanReviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

describe('react-navigation migration', () => {
  test('switching tabs preserves each tab screen\'s local state', async () => {
    const { getByTestId, getByText, findByTestId } = render(<TestApp />);

    act(() => resetTo('Groups'));
    await findByTestId('groups-count');

    fireEvent.press(getByTestId('groups-increment'));
    expect(getByTestId('groups-count').props.children).toBe(1);

    fireEvent.press(getByText('Friends'));
    fireEvent.press(getByText('Groups'));

    // Previously nav.reset(tab.route) wiped the whole stack on every tab
    // press; with bottom-tabs, switching back must keep the same instance.
    expect(getByTestId('groups-count').props.children).toBe(1);
  });

  test('pushing from a screen nested in the tab navigator reaches the root stack, with params (including renamed keys and non-serializable objects) intact', async () => {
    const { getByTestId, findByTestId } = render(<TestApp />);

    act(() => resetTo('Groups'));
    await findByTestId('groups-push-detail');

    fireEvent.press(getByTestId('groups-push-detail'));
    const detailId = await findByTestId('detail-id');
    expect(detailId.props.children).toBe('g1');

    fireEvent.press(getByTestId('detail-push-expense'));
    const expenseParams = await findByTestId('expense-params');
    expect(expenseParams.props.children).toBe('g1:e1');
  });

  test('non-serializable object params (e.g. a fetched receipt scan) pass through unchanged', async () => {
    const { getByTestId, findByTestId } = render(<TestApp />);

    act(() => resetTo('Groups'));
    fireEvent.press(getByTestId('groups-push-detail'));
    await findByTestId('detail-id');

    fireEvent.press(getByTestId('detail-push-scan-review'));
    const merchant = await findByTestId('scan-review-merchant');
    expect(merchant.props.children).toBe('Cafe');
  });

  test('resetTo navigates to Login from outside any component (the session-expiry case)', async () => {
    const { findByTestId } = render(<TestApp />);

    act(() => resetTo('Groups'));
    await findByTestId('groups-count');

    // Simulates AuthContext's onSessionExpired callback, which fires from
    // an async API-client hook with no access to React hooks/context.
    act(() => resetTo('Login'));

    await waitFor(() => expect(navigationRef.getCurrentRoute()?.name).toBe('Login'));
  });
});
