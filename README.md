# RAMP-CD

RAMP-CD contains two clients for **RAMP - Real-Time Accessibility Map Powered by Crowdsourced Data**:

```text
RAMP-CD/
├── web/
└── mobile/
```

Both versions use the same Firebase project and shared collections for users, locations, reviews, reports, and accessibility data.

## Web Version

The web app is a ReactJS application for community members and administrators.

### Web Features

- Firebase email/password authentication
- Registration, login, forgot password, logout, and session persistence
- Friendly login validation messages
- Protected user routes and admin-only routes
- Responsive dashboard with RAMP branding, statistics, categories, recent locations, and quick actions
- Interactive React Leaflet map
- Real-time Firestore location markers
- Search and filter accessibility locations
- Add and edit accessibility locations
- Place/address search with map positioning
- Pin selection with auto-filled address, latitude, and longitude
- Photo uploads through Firebase Storage
- Location details with larger map area, score, photos, contributor info, and verification status
- Ratings and reviews
- Helpful/upvote and report actions
- User profile editing
- User profile section for contributed places
- Owner-only location edit/delete controls
- Admin dashboard for moderation
- Approve, reject, and delete submitted locations
- Admin user management with user search, promote to Admin, and demote to User
- Dark mode, toast notifications, loading states, empty states, logo, and favicon

### Run Web

```bash
cd web
npm install
npm run dev
```

## Mobile Version

The mobile app is an Expo React Native app intended for community members who contribute and explore accessibility information on phones.

### Mobile Features

- Expo SDK 54 React Native app
- Firebase email/password authentication
- Registration, login, forgot password, logout, and session persistence
- Friendly login validation messages
- Visible native headers across screens
- Header Home shortcut on logged-in screens
- Home screen with map, add location, profile, and recent places access
- Profile screen with user role and contributed places
- Map screen with real-time accessibility locations
- Add Location flow aligned with the web version
- Place/address search, map positioning, tap/long-press pin selection, and auto-filled location fields
- Photo selection and upload to Firebase Storage
- Location details with map, photos, accessibility score, ratings, and reviews
- Helpful/upvote and report actions
- Owner-only edit/delete controls
- Edit mode for contributed locations
- RAMP logo, app icon, splash image, and mobile-friendly UI

### Run Mobile

```bash
cd mobile
npm install
npx expo start -c
```

Then scan the QR code with Expo Go, open an emulator/simulator, or press `w` to test in a browser.

## Shared Firebase Collections

- `users`
- `locations`
- `reviews`
- `reports`
- `accessibility_features`

## Notes

- `.env` files are ignored and should not be committed.
- `node_modules`, build folders, and Expo cache are ignored.
- Web and mobile should point to the same Firebase project to share data.
