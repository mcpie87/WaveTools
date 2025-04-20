'use client';

import { runMigrations } from "@/migrations/runMigrations";
import { useEffect, useState } from "react";

interface ClientInitProps {
  children: React.ReactNode;
}
export const ClientInit = ({ children }: ClientInitProps) => {
  const [isReady, setIsReady] = useState(false);
  const [migrationsResult, setMigrationsResult] = useState<boolean | null>(null);
  useEffect(() => {
    const run = async () => {
      const result = await runMigrations();
      setMigrationsResult(result);
      setIsReady(true);
    };
    run();
  }, []);

  if (!isReady) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Performing migrations...
      </div>
    );
  }
  if (migrationsResult === false) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Migrations failed. Please contact the developer.
      </div>
    );
  }

  return <>{children}</>;
};
