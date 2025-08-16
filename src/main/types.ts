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

export interface License {
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

export type Settings = {
  licenseKey?: string; // the product key the user typed (e.g., ABCDE-...)
  licenseAsString?: string; // serialized License (for offline)
  typeScheduleId?: string;
  countryId?: string;
  stateId?: string;
};
