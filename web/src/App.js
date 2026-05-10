import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import ToastNotification from './components/ToastNotification';

export default function App() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(AnimatePresence, { mode: 'wait' }, React.createElement(AppRoutes)),
    React.createElement(ToastNotification),
  );
}
