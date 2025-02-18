import { PagingResponse, WebResponse } from '../interface/web-response.interface';

export const apiResponse = <T>(
  statusCode: number,
  message: string,
  data: T | null = null,
  paging?: PagingResponse,
): WebResponse<T> => {
  return {
    statusCode,
    message,
    data,
    paging,
  };
};
