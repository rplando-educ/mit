# RAMP-CD Workspace

This repository is organized for two RAMP clients:

```text
RAMP-CD/
├── web/
└── mobile/
```

## Web App

The existing ReactJS web application lives in `web/`.

```bash
cd web
npm install
npm run dev
```

## Mobile App

The React Native/Expo application should be created in `mobile/`.

```bash
cd mobile
npx create-expo-app .
```

Both apps can use the same Firebase project and collections.
