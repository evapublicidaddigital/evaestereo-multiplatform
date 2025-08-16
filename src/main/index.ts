import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import * as Crypto from "cryptolens";
import type { License, Settings } from "./types";

const PROBE_URL =
  process.env.VITE_APP_PING_URL || "https://clients3.google.com/generate_204";
const PROBE_TIMEOUT_MS = 3000;

async function isOnline(): Promise<boolean> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(PROBE_URL, {
      method: "HEAD",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 512,
    height: 800,
    resizable: true,
    // resizable: false,
    show: true,
    // show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const { default: ElectronStore } = await import("electron-store");

  const store = new ElectronStore<Settings>({
    name: "settings",
    schema: {
      licenseKey: { type: "string" },
      licenseAsString: { type: "string" },
      typeScheduleId: { type: "string" },
      countryId: { type: "string" },
      stateId: { type: "string" },
    },
  });

  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const RSAPubKey = import.meta.env.VITE_APP_RSA_KEY as string;

  ipcMain.handle("validate-license", async (_, license: string) => {
    try {
      console.log("🦋🦋🦋🦋🦋🦋🦋🦋🦋", license);
      const ProductId = import.meta.env.VITE_APP_PRODUCT_ID as string;
      const token = import.meta.env.VITE_APP_ACCESS_TOKEN as string;

      const Key = license;
      const MachineCode = Crypto.Helpers.GetMachineCode();
      const result: License = await Crypto.Key.Activate(
        token,
        RSAPubKey,
        ProductId,
        Key,
        MachineCode,
      );
      const licenseString = Crypto.Helpers.SaveAsString(result);
      store.set("licenseKey", Key);
      store.set("licenseAsString", licenseString);
      return result;
    } catch (error) {
      return error;
    }
  });

  ipcMain.handle("clear-license", async () => {
    store.delete("licenseKey");
    store.delete("licenseAsString");
    return;
  });

  ipcMain.handle("verify-license", async () => {
    const ProductId = import.meta.env.VITE_APP_PRODUCT_ID as string;
    const token = import.meta.env.VITE_APP_ACCESS_TOKEN as string;
    const MachineCode = Crypto.Helpers.GetMachineCode();

    const cachedKey = store.get("licenseKey") as string | undefined; // product key
    const cachedString = store.get("licenseAsString") as string | undefined; // serialized license

    // 1) Try ONLINE first if we appear to have internet
    if (await isOnline()) {
      if (!cachedKey) {
        // We have internet but no stored product key → can’t re-activate; fall back to offline.
        if (!cachedString) throw new Error("No cached license available.");
      } else {
        try {
          const result: License = await Crypto.Key.Activate(
            token,
            RSAPubKey,
            ProductId,
            cachedKey,
            MachineCode,
          );
          const licenseString = Crypto.Helpers.SaveAsString(result);
          // refresh cache
          store.set("licenseAsString", licenseString);
          return result;
        } catch (e) {
          // If the server rejects the key (invalid/expired), don’t silently pass offline.
          // Only fall back offline if it *looks like* a network issue. Otherwise, rethrow.
          const msg = String((e && (e as Error).message) || e);
          const networkish =
            /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|fetch|network|timeout|abort/i.test(
              msg,
            );
          if (!networkish) throw e;
          // otherwise continue to offline
        }
      }
    }

    // 2) OFFLINE fallback using cached serialized license
    if (!cachedString)
      throw new Error("Offline and no cached license available.");
    // 30 = allow up to 30 days (adjust per your policy)
    return Crypto.Helpers.LoadFromString(RSAPubKey, cachedString, 30);
  });

  ipcMain.handle("load-from-string", async (_, license: string) => {
    return Crypto.Helpers.LoadFromString(RSAPubKey, license, 30);
  });

  ipcMain.on("electron-store-get", async (event, val) => {
    event.returnValue = store.get(val);
  });

  ipcMain.on("electron-store-set", async (_event, key, val) => {
    store.set(key, val);
  });

  ipcMain.on("electron-store-delete", async (_event, key) => {
    store.delete(key);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
