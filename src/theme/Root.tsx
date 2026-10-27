import React from 'react';
import DocsAssistantProvider from '../assistant/DocsAssistantProvider';
import { CookieConsentProvider } from '../components/CookieConsent';

export default function Root({children}: {children: React.ReactNode}) {
  return (
    <CookieConsentProvider>
      <DocsAssistantProvider>{children}</DocsAssistantProvider>
    </CookieConsentProvider>
  );
}
