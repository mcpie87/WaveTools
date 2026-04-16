'use client';

import { runMigrations } from "@/migrations/runMigrations";
import { useEffect, useState } from "react";
import { hydrateRegisteredStores } from "@/app/map/state/storeRegistry";

interface ClientInitProps {
  children: React.ReactNode;
}

export const ClientInit = ({ children }: ClientInitProps) => {
  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending');
  console.log("[ClientInit] Status:", status);

  useEffect(() => {
    (async () => {
      console.log("[ClientInit] Running migrations...");
      const result = await runMigrations();
      if (!result) {
        setStatus('error');
        return;
      }
      console.log("[ClientInit] Hydrating registered stores...");
      hydrateRegisteredStores();
      setStatus('done');
    })();
  }, []);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Migrations failed. Please contact the developer.</div>;
  return <>{children}</>;
};