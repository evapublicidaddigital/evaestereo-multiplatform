import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  validateLicense: (license: string): Promise<unknown> =>
    ipcRenderer.invoke("validate-license", license),
  clearLicense: (): Promise<unknown> => ipcRenderer.invoke("clear-license"),
  loadFromString: (license: string): Promise<unknown> =>
    ipcRenderer.invoke("load-from-string", license),
  verifyLicense: (): Promise<unknown> => ipcRenderer.invoke("verify-license"),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("electron", {
      ...electronAPI,
      store: {
        get(key) {
          return ipcRenderer.sendSync("electron-store-get", key);
        },
        set(property, val) {
          ipcRenderer.send("electron-store-set", property, val);
        },
        delete(key) {
          ipcRenderer.send("electron-store-delete", key);
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = {
    ...electronAPI,
    store: {
      get(key) {
        return ipcRenderer.sendSync("electron-store-get", key);
      },
      set(property, val) {
        ipcRenderer.send("electron-store-set", property, val);
      },
      delete(key) {
        ipcRenderer.send("electron-store-delete", key);
      },
    },
  };
  // @ts-ignore (define in dts)
  window.api = api;
}
