import type { FetchUserAttributesOutput } from "aws-amplify/auth";

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: FetchUserAttributesOutput | null;
  authStep: AuthStep;
  error: AuthError | null;
  license: LicenseResponse | null;
  showSelectCountry: boolean;
  signIn: (phone: string) => Promise<void>;
  signUp: (phone: string) => Promise<void>;
  confirmSignUp: (code: string) => Promise<void>;
  confirmSignIn: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetAuthStep: () => void;
  clearError: () => void;
  validateLicense: () => Promise<void>;
};

export type AuthStep =
  | "idle"
  | "signUp"
  | "signIn"
  | "confirmSignUp"
  | "confirmSignIn"
  | "signedIn";

export type AuthError = {
  type: AuthErrorType;
  message: string;
  code?: string;
};

export type AuthErrorType =
  | "SIGN_UP_FAILED"
  | "SIGN_IN_FAILED"
  | "CONFIRMATION_FAILED"
  | "SIGN_OUT_FAILED"
  | "USER_ALREADY_EXISTS"
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "USER_NOT_FOUND"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface Customer {
  Id: number;
  Name: string;
  Email: string;
  CompanyName: string;
  Created: number;
}

export interface ActivatedMachine {
  Mid: string;
  IP: string;
  Time: number;
}

export interface RawResponse {
  licenseKey: string;
  signature: string;
  result: number;
  message: string;
}
export interface LicenseResponse {
  ProductId: number;
  ID: number;
  Key: string;
  Created: number;
  Expires: number;
  Period: number;
  F1: boolean;
  F2: boolean;
  F3: boolean;
  F4: boolean;
  F5: boolean;
  F6: boolean;
  F7: boolean;
  F8: boolean;
  Notes: string;
  Block: boolean;
  GlobalId: number;
  Customer: Customer;
  ActivatedMachines: ActivatedMachine[];
  TrialActivation: boolean;
  MaxNoOfMachines: number;
  AllowedMachines: string;
  DataObjects: unknown[];
  SignDate: number;
  RawResponse: RawResponse;
}
