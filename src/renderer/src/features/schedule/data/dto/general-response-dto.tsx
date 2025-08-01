export interface GeneralResponseDto<T> {
  items: T[];
  message: string;
  error: boolean;
  next_token?: string;
}