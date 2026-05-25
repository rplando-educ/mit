# RAMP - Real-Time Accessibility Map Powered by Crowdsourced Data

RAMP is a ReactJS accessibility mapping platform for discovering and contributing verified information about ramps, accessible restrooms, elevators, PWD parking, tactile paths, and accessible entrances.

## Tech Stack

- ReactJS with functional components and Hooks
- React Router DOM
- Firebase Authentication, Firestore, and Storage
- React Leaflet
- Tailwind CSS
- React Context API
- React Icons
- Framer Motion
- Axios-ready service layer

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add Firebase values.

3. Run the app:

```bash
npm run dev
```

The local development URL is:

```text
http://localhost:5174
```

This project uses port `5174` to avoid colliding with another Vite app that may already be running on `5173`.

## Firestore Collections

- `users`
- `locations`
- `reviews`
- `reports`
- `accessibility_features`

## Firebase Rules Starter

Adjust for your production moderation workflow.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isOwner(userId) { return signedIn() && request.auth.uid == userId; }
    function isAdmin() {
      return signedIn()
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "Admin";
    }

    match /users/{userId} {
      allow read: if signedIn();
      allow create: if isOwner(userId) && request.resource.data.role == "User";
      allow update: if isAdmin()
        || (isOwner(userId) && request.resource.data.role == resource.data.role);
      allow delete: if isAdmin();
    }

    match /locations/{locationId} {
      allow read: if true;
      allow create: if signedIn();
      allow update, delete: if isAdmin()
        || (signedIn() && resource.data.contributorId == request.auth.uid);
    }

    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if signedIn();
      allow update, delete: if signedIn() && resource.data.userId == request.auth.uid;
    }

    match /reports/{reportId} {
      allow create: if signedIn();
      allow read, update, delete: if isAdmin();
    }
  }
}
```
