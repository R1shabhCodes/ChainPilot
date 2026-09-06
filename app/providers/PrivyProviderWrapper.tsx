'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia, mainnet } from 'viem/chains';

export default function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Safely render children during static prerendering or when NEXT_PUBLIC_PRIVY_APP_ID is not yet set
  if (!privyAppId || privyAppId === 'placeholder-privy-app-id') {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#06b6d4', // Cyan accent to match ChainPilot design tokens
          logo: 'https://auth.privy.io/logos/privy-logo.png',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        defaultChain: sepolia,
        supportedChains: [sepolia, mainnet],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
