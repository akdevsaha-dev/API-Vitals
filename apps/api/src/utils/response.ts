import { Response } from "express";
import { ApiResponse } from "@repo/types";

export class ApiError extends Error {
  public statusCode: number;
  public error?: any;

  constructor(message: string, statusCode: number = 500, error?: any) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any,
) => {
  const response: ApiResponse<null> & { error?: any } = {
    success: false,
    data: null,
    message,
  };

  if (error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};
