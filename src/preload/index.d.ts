import { ElectronAPI } from "@electron-toolkit/preload";
import type { License } from "../main/types";

declare global {
  interface Window {
    electron: ElectronAPI & {
      store: {
        get<T = unknown>(key: string): Promise<T>;
        set(key: string, value: unknown): Promise<void>;
        has(key: string): Promise<boolean>;
        delete(key: string): Promise<void>;
      };
    };
    api: {
      validateLicense: (license: string) => Promise<License>;
      clearLicense: () => Promise<void>;
      loadFromString: (license: string) => Promise<License>;
      verifyLicense: () => Promise<unknown>;
    };
  }
}
