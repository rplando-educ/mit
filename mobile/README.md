# RAMP Mobile

This folder contains the React Native/Expo community app for RAMP.

## Run

```bash
npm install
npm start
```

Then scan the QR code with Expo Go or open the app in an Android/iOS simulator.

## Run In Browser

If you do not have Expo Go, run:

```bash
npm run web
```

The browser version uses a web-safe map preview. Native map gestures and pins are available when running on Android/iOS with Expo Go or a simulator.

## Features

- Firebase email/password authentication
- Shared `users`, `locations`, and `reviews` collections with the web app
- Map view of accessibility locations
- Search place/address, center map, drop pin, and submit a location
- Photo upload to Firebase Storage
- Location details and ratings/reviews
