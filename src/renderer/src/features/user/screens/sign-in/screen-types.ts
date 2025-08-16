export type ScreenContextType = {
  license: string;
  handleLicenseChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleValidate: () => void;
};
