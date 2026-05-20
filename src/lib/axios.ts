"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { emitAuthUnauthorized, emitToast } from "@/lib/client-events";
import type { LaravelValidationError, ValidationErrors } from "@/types/api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=")[1] ?? "");
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const xsrfToken = getCookie("XSRF-TOKEN");

  if (xsrfToken) {
    config.headers.set("X-XSRF-TOKEN", xsrfToken);
    config.headers.set("X-CSRF-TOKEN", xsrfToken);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<LaravelValidationError>) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      emitAuthUnauthorized();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    if (status === 422) {
      return Promise.reject(
        Object.assign(error, {
          fieldErrors: error.response?.data.errors ?? {},
        }),
      );
    }

    if (status && status >= 500) {
      emitToast({
        message: "Server error. Please try again in a moment.",
        variant: "error",
      });
    }

    return Promise.reject(error);
  },
);

export function getValidationErrors(error: unknown): ValidationErrors {
  if (axios.isAxiosError<LaravelValidationError>(error) && "fieldErrors" in error) {
    return (error as AxiosError<LaravelValidationError> & { fieldErrors: ValidationErrors })
      .fieldErrors;
  }

  if (axios.isAxiosError<LaravelValidationError>(error)) {
    return error.response?.status === 422 ? error.response.data.errors : {};
  }

  return {};
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (axios.isAxiosError<LaravelValidationError>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  return fallback;
}

export default api;
