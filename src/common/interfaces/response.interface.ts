/* eslint-disable @typescript-eslint/no-explicit-any */
// success: true => message, data
// success: false => errorMessage, error

export interface IResponse {
  success: boolean;
  message: string;
  errorMessage: string;
  data: any[];
  error: any;
}
