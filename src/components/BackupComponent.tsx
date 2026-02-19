"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Upload,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DatabaseBackup,
} from "lucide-react";

export enum LocalStorageKey {
  THEME = "theme",
  SCHEMA_VERSION = "schema_version",
  RESONATORS = "resonators",
  WEAPONS = "weapons",
  INVENTORY = "items",
  UNION_LEVELS = "union_levels",
  MAP = "map",
}

const LS_PREFIX = "wave_tools_";
const BACKUP_VERSION = 1;

interface BackupFile {
  version: number;
  exportedAt: string;
  appVersion: string;
  data: Partial<Record<LocalStorageKey, unknown>>;
}

type ImportStatus =
  | { type: "idle" }
  | { type: "success"; count: number }
  | { type: "error"; message: string }
  | { type: "loading" };

// ── Backup logic ──────────────────────────────────────────────────────────────

function exportBackup(): void {
  const data: Partial<Record<LocalStorageKey, unknown>> = {};

  for (const key of Object.values(LocalStorageKey)) {
    const raw = localStorage.getItem(`${LS_PREFIX}${key}`);
    if (raw !== null) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  }

  const backup: BackupFile = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "unknown",
    data,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wavetools-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importBackup(file: File): Promise<number> {
  const text = await file.text();
  const backup: BackupFile = JSON.parse(text);

  if (!backup.version || !backup.data) {
    throw new Error("Invalid backup file format.");
  }

  if (backup.version > BACKUP_VERSION) {
    throw new Error(
      `Backup was created with a newer version of WaveTools (v${backup.version}). Please update the app.`
    );
  }

  const validKeys = new Set(Object.values(LocalStorageKey));
  let count = 0;

  for (const [key, value] of Object.entries(backup.data)) {
    if (!validKeys.has(key as LocalStorageKey)) continue;
    localStorage.setItem(
      `${LS_PREFIX}${key}`,
      typeof value === "string" ? value : JSON.stringify(value)
    );
    count++;
  }

  return count;
}

function getStorageSnapshot(): { key: LocalStorageKey; hasData: boolean; size: string }[] {
  return Object.values(LocalStorageKey).map((key) => {
    const raw = localStorage.getItem(`${LS_PREFIX}${key}`);
    const bytes = raw ? new Blob([raw]).size : 0;
    const size =
      bytes === 0
        ? "—"
        : bytes < 1024
          ? `${bytes} B`
          : `${(bytes / 1024).toFixed(1)} KB`;
    return { key, hasData: raw !== null, size };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BackupManager() {
  const [open, setOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>({ type: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const snapshot = getStorageSnapshot();
  const populatedCount = snapshot.filter((s) => s.hasData).length;

  function handleExport() {
    exportBackup();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus({ type: "loading" });

    try {
      const count = await importBackup(file);
      setImportStatus({ type: "success", count });
    } catch (err) {
      setImportStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Unknown error.",
      });
    } finally {
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleImportClick() {
    setImportStatus({ type: "idle" });
    fileInputRef.current?.click();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <DatabaseBackup className="h-4 w-4" />
          Backup
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Backup &amp; Restore
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Your data is stored locally in this browser. Export a backup to keep
          it safe or transfer it to another device.
        </p>

        {/* Storage snapshot */}
        <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Current data ({populatedCount}/{snapshot.length} keys)
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {snapshot.map(({ key, hasData, size }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-foreground/70 truncate">
                  {key}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {hasData ? (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {size}
                    </Badge>
                  ) : (
                    <span className="text-foreground/30">—</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleExport}
            className="w-full gap-2"
            disabled={populatedCount === 0}
          >
            <Download className="h-4 w-4" />
            Export backup (.json)
          </Button>

          <Button
            variant="outline"
            onClick={handleImportClick}
            className="w-full gap-2"
          >
            <Upload className="h-4 w-4" />
            Import backup
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Import status */}
        {importStatus.type === "loading" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Importing...
          </div>
        )}

        {importStatus.type === "success" && (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-emerald-600 dark:text-emerald-400">
                Import successful
              </p>
              <p className="text-muted-foreground">
                {importStatus.count} keys restored. Refresh the page to apply changes.
              </p>
            </div>
          </div>
        )}

        {importStatus.type === "error" && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Import failed</p>
              <p className="text-muted-foreground">{importStatus.message}</p>
            </div>
          </div>
        )}

        {importStatus.type === "idle" && populatedCount === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            No local data found. Start using the app to generate data worth backing up.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}