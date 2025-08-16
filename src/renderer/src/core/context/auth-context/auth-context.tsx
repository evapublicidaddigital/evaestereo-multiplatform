import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  signIn,
  signUp,
  confirmSignUp,
  confirmSignIn,
  signOut,
  fetchAuthSession,
  fetchUserAttributes,
  type FetchUserAttributesOutput,
} from "aws-amplify/auth";

import type {
  AuthContextType,
  AuthStep,
  AuthError,
  LicenseResponse,
} from "./auth-context.types";
import { mapErrorToAuthError } from "@renderer/core/utils/map-error-to-auth-error";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authStep, setAuthStep] = useState<AuthStep>("idle");
  const [error, setError] = useState<AuthError | null>(null);
  const [license, setLicense] = useState<LicenseResponse | null>(null);
  const [showSelectCountry, setShowSelectCountry] = useState(false);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const checkAuthSession = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchAuthSession();
      const attributes = await fetchUserAttributes();
      setUser(attributes);
      setIsAuthenticated(true);
      setAuthStep("signedIn");
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setAuthStep("idle");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignUp = useCallback(async (phone: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp({
        username: phone,
        password: `P@ssword${Date.now()}`, // Dummy password for phone-only auth
        options: {
          userAttributes: {
            phone_number: phone,
          },
        },
      });
      setUsername(phone);
      setAuthStep("confirmSignUp");
    } catch (err) {
      const authError = mapErrorToAuthError(err);

      // Special handling for existing user
      if (authError.type === "USER_ALREADY_EXISTS") {
        setUsername(phone);
        setAuthStep("signIn");
        setError({
          type: "USER_ALREADY_EXISTS",
          message: "Usuario ya existe. Redirigiendo a inicio de sesión...",
        });
      } else {
        setError({
          ...authError,
          type: "SIGN_UP_FAILED",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignIn = useCallback(
    async (phone: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const { nextStep } = await signIn({
          username: phone,
          options: {
            authFlowType: "USER_AUTH",
            preferredChallenge: "SMS_OTP",
          },
        });

        setUsername(phone);

        if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
          setAuthStep("confirmSignIn");
        } else if (nextStep.signInStep === "DONE") {
          await checkAuthSession();
        }
      } catch (err) {
        const authError = mapErrorToAuthError(err);
        setError({
          ...authError,
          type: "SIGN_IN_FAILED",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuthSession],
  );

  const handleConfirmSignUp = useCallback(
    async (code: string): Promise<void> => {
      if (!username) {
        setError({
          type: "CONFIRMATION_FAILED",
          message: "Error interno: número de teléfono no encontrado",
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { isSignUpComplete } = await confirmSignUp({
          username,
          confirmationCode: code,
        });

        if (isSignUpComplete) {
          // Auto sign in after successful confirmation
          await handleSignIn(username);
        }
      } catch (err) {
        const authError = mapErrorToAuthError(err);
        setError({
          ...authError,
          type: "CONFIRMATION_FAILED",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [handleSignIn, username],
  );

  const handleConfirmSignIn = useCallback(
    async (code: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const { nextStep } = await confirmSignIn({
          challengeResponse: code,
        });

        if (nextStep.signInStep === "DONE") {
          await checkAuthSession();
        }
      } catch (err) {
        const authError = mapErrorToAuthError(err);
        setError({
          ...authError,
          type: "CONFIRMATION_FAILED",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuthSession],
  );

  const handleSignOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      setAuthStep("idle");
      setUsername("");
    } catch (err) {
      const authError = mapErrorToAuthError(err);
      setError({
        ...authError,
        type: "SIGN_OUT_FAILED",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetAuthStep = useCallback((): void => {
    setAuthStep("idle");
    setError(null);
  }, []);

  /**
   * Validates the license by checking its expiration date and period.
   * This function is called once on component mount and then every 24 hours.
   * If the license is expired or the period is invalid, the user is de-authenticated.
   */
  const validateLicense = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await window.api.verifyLicense();
      if (result) {
        const licenseData = result as LicenseResponse;
        // The expiration date is converted from seconds to milliseconds.
        const expirationDate = new Date((licenseData.Expires ?? 0) * 1000);
        const now = new Date();

        // The license is validated by checking the expiration date and period.
        if (expirationDate < now || (licenseData.Period ?? 0) < 0) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
        setLicense(licenseData);
        const typeScheduleId = (await window.electron.store.get(
          "typeScheduleId",
        )) as string;
        const countryId = (await window.electron.store.get(
          "countryId",
        )) as string;
        const stateId = (await window.electron.store.get("stateId")) as string;
        if (typeScheduleId && countryId && stateId) {
          setShowSelectCountry(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log("🦋🦋🦋🦋🦋🦋🦋🦋🦋 ========", error);
      alert("Error al validar la licencia");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateLicense2 = useCallback(async (): Promise<void> => {
    try {
      const result = await window.api.verifyLicense();
      if (result) {
        const licenseData = result as LicenseResponse;
        // The expiration date is converted from seconds to milliseconds.
        const expirationDate = new Date((licenseData.Expires ?? 0) * 1000);
        const now = new Date();

        // The license is validated by checking the expiration date and period.
        if (expirationDate < now || (licenseData.Period ?? 0) < 0) {
          setIsAuthenticated(false);
          return;
        }
      }
    } catch (error) {
      console.log("🦋🦋🦋🦋🦋🦋🦋🦋🦋 ========", error);
      alert("Error al validar la licencia");
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    // The license is validated once on component mount.
    validateLicense();

    // The license is validated every 24 hours to ensure it is still valid.
    const intervalId = setInterval(validateLicense, 48 * 60 * 60 * 1000); // 48 hours
    // For testing purposes, the interval can be set to 2 minutes.
    // const intervalId = setInterval(validateLicense2, 1 * 60 * 1000); // 2 minutes

    // The interval is cleared when the component is unmounted.
    return () => clearInterval(intervalId);
  }, [validateLicense, validateLicense2]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      authStep,
      error,
      license,
      showSelectCountry,
      signIn: handleSignIn,
      signUp: handleSignUp,
      confirmSignUp: handleConfirmSignUp,
      confirmSignIn: handleConfirmSignIn,
      signOut: handleSignOut,
      resetAuthStep,
      clearError,
      validateLicense,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      authStep,
      error,
      license,
      showSelectCountry,
      handleSignIn,
      handleSignUp,
      handleConfirmSignUp,
      handleConfirmSignIn,
      handleSignOut,
      resetAuthStep,
      clearError,
      validateLicense,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
}
