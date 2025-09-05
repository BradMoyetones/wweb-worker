import './assets/main.css'
// Supports weights 100-900
import '@fontsource-variable/onest';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { Toaster } from './components/ui/sonner';
import { ThemeProvider, VersionProvider } from './contexts';
import { WhatsAppProvider } from './contexts/WhatsAppContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
        <VersionProvider>
          <WhatsAppProvider>
            <RouterProvider router={router} />
            <Toaster />
          </WhatsAppProvider>
        </VersionProvider>
    </ThemeProvider>
  </React.StrictMode>
)
