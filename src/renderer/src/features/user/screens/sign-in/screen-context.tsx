import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ScreenContextType } from "./screen-types";

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export function ScreenProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [license, setLicense] = useState("");

  const handleLicenseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const rawValue = event.target.value
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase();
      if (rawValue.length > 20) {
        return;
      }
      const formattedValue = rawValue.match(/.{1,5}/g)?.join("-") ?? "";
      setLicense(formattedValue);
    },
    [],
  );

  const handleValidate = useCallback(async (): Promise<void> => {
    try {
      console.log("Validating license:", license);
      const result = await window.api.validateLicense(license);

      console.log(
        "🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒 🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒",
        result,
      );
    } catch (error) {
      console.log("🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒🎒", error);
    }
  }, [license]);

  return (
    <ScreenContext.Provider
      value={{ license, handleLicenseChange, handleValidate }}
    >
      {children}
    </ScreenContext.Provider>
  );
}
export function useScreenProvider(): ScreenContextType {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useScreenProvider must be used within a ScreenProvider");
  }
  return context;
}
