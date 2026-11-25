import React from 'react';
import DocsAssistantProvider from '../assistant/DocsAssistantProvider';

export default function Root({children}: {children: React.ReactNode}) {
  return <DocsAssistantProvider>{children}</DocsAssistantProvider>;
}
