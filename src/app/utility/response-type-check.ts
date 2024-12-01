import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";

export function isSuccessResponse(res: any): res is SuccessResponse {
    return res.status === "Success";
  }
  
export function isErrorResponse(res: any): res is ErrorResponse {
    return res.status === "Failed";
  }