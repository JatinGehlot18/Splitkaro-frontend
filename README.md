# Splitkaro

Split shared expenses with your flatmates and friends — a React Native app that
mirrors the design mockup, backed by a mock API that returns **static** JSON for
both **auth** and **data**.

## What's here

```
App.tsx              # app entry: providers + navigator wiring
src/
  api/               # fetch client, typed endpoints, response types
  auth/              # auth context (token + user)
  theme/             # light/dark theme (mockup colors) + provider
  nav/               # tiny JS-only stack navigator (no native deps)
  components/        # shared UI primitives (Screen, Avatar, buttons, …)
  screens/           # one file per screen (see below)
  util/              # rupee formatter, useApi hook
server/              # Express mock API — static responses for auth + data
```

### Screens (from the mockup)

Login → Profile setup → Groups → Group detail (Balances / Expenses tabs) →
Create group · Add expense (+ paid-by picker) · Split unevenly · Expense detail ·
Settle up · Search · Scan receipt → Review.

## Data & auth come from an API

The app never hardcodes data — every screen calls the mock API over HTTP
(`src/api`). The server in `/server` returns fixed, static responses (see
`server/data.js`), so there is no database and login always succeeds with a demo
user. This keeps the API contract real while the payloads stay predictable.

## Run it

**1. Start the mock API** (terminal 1):

```bash
cd server
npm install      # first time only
npm start        # http://localhost:3001
```

**2. Start Metro + the app** (terminal 2, from the repo root):

```bash
npm install      # first time only
npm start        # Metro bundler

# then, in terminal 3:
npm run ios      # or: npm run android
```

### API host per platform

`src/api/client.ts` targets the host machine automatically:

- **iOS simulator** → `http://localhost:3001`
- **Android emulator** → `http://10.0.2.2:3001`

Running on a **physical device**? Set `API_HOST` in `src/api/client.ts` to your
computer's LAN IP (e.g. `192.168.1.x`) and make sure the device is on the same
network.

## Notes

- The navigator is a ~90-line JS stack (`src/nav/navigation.tsx`) so the app runs
  in Metro with no extra pod/gradle linking.
- If a screen shows an error state, the mock API isn't reachable — start it with
  `cd server && npm start`.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
# Splitkaro-frontend