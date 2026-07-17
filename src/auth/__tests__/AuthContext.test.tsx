import { act, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { User } from '../../api/types';
import { AuthProvider, useAuth } from '../AuthContext';
import { clearSession, loadSession } from '../sessionStorage';

jest.mock('../../api/endpoints', () => ({
  profileApi: { me: jest.fn(() => Promise.reject(new Error('no network in tests'))) },
  toUser: jest.fn(),
}));

jest.mock('../../nav/navigation', () => ({ resetTo: jest.fn() }));

const testUser: User = {
  id: 'u1',
  name: 'Rohan Mehta',
  first: 'Rohan',
  initials: 'RM',
  avatarBg: '#000',
  email: 'rohan@example.com',
  isMe: true,
};

function Consumer() {
  const { isRestoring, token, user, setAuth, signOut } = useAuth();
  return (
    <>
      <Text testID="restoring">{String(isRestoring)}</Text>
      <Text testID="token">{token ?? 'none'}</Text>
      <Text testID="user">{user?.name ?? 'none'}</Text>
      <Text testID="set-auth" onPress={() => setAuth('access-1', 'refresh-1', testUser)}>
        set
      </Text>
      <Text testID="sign-out" onPress={() => signOut()}>
        out
      </Text>
    </>
  );
}

describe('AuthContext session persistence', () => {
  beforeEach(async () => {
    await clearSession();
  });

  test('restores with isRestoring=false and no session when nothing is persisted', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(getByTestId('restoring').props.children).toBe('false'));
    expect(getByTestId('token').props.children).toBe('none');
    expect(getByTestId('user').props.children).toBe('none');
  });

  test('setAuth persists the session, and a fresh provider mount restores it optimistically', async () => {
    const first = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(first.getByTestId('restoring').props.children).toBe('false'));

    act(() => first.getByTestId('set-auth').props.onPress());
    await waitFor(async () => expect(await loadSession()).toEqual({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      user: testUser,
    }));
    first.unmount();

    const second = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(second.getByTestId('token').props.children).toBe('access-1'));
    expect(second.getByTestId('user').props.children).toBe('Rohan Mehta');
  });

  test('signOut clears the persisted session', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(getByTestId('restoring').props.children).toBe('false'));

    act(() => getByTestId('set-auth').props.onPress());
    await waitFor(async () => expect(await loadSession()).not.toBeNull());

    act(() => getByTestId('sign-out').props.onPress());
    await waitFor(async () => expect(await loadSession()).toBeNull());
  });
});
