'use client';

import { STORAGE_KEY } from '@/services/LocalStorageService';
import { LOCAL_STORAGE_SCHEMA_VERSION, LocalStorageKey } from '@/types/localStorageTypes';
import { useEffect, useState } from 'react';
import { ModalComponent } from './PlannerForm/ModalComponent';
import { Button } from './ui/button';

const CURRENT_SCHEMA = LOCAL_STORAGE_SCHEMA_VERSION;
const SCHEMA_VERSION_KEY = `${STORAGE_KEY}_${LocalStorageKey.SCHEMA_VERSION}`;

export default function SchemaGuard() {
  const [isOutdated, setIsOutdated] = useState(false);

  useEffect(() => {
    const checkSchema = () => {
      const stored = localStorage.getItem(SCHEMA_VERSION_KEY);

      console.log(SCHEMA_VERSION_KEY, stored);
      if (stored === null) return;

      if (stored > CURRENT_SCHEMA) {
        console.log(`Schema version is outdated: OLD: ${CURRENT_SCHEMA} -> NEW: ${stored}`);
        setIsOutdated(true);
      }
    };

    // Check on boot
    checkSchema();

    // Check cross-tab changes
    const handler = (e: StorageEvent) => {
      if (e.key === SCHEMA_VERSION_KEY) {
        checkSchema();
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  if (!isOutdated) return null;
  return (
    <ModalComponent show={true} onClose={() => setIsOutdated(false)} blockClose={true}>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">WaveTools update required</h1>
        <p className="text-sm">Please refresh to ensure data compatibility.</p>
        <div>
          <p className="text-sm">
            Current version: <span className="font-bold">{CURRENT_SCHEMA}</span>
          </p>
          <p className="text-sm">
            Stored version: <span className="font-bold">{localStorage.getItem(SCHEMA_VERSION_KEY)}</span>
          </p>
        </div>
        <p className="text-sm">
          This message has appeared due to using this page with multiple tabs<br /> and I do not want you to lose any progress you save.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className=""
        >
          Refresh Now
        </Button>
      </div>
    </ModalComponent>
  );
}