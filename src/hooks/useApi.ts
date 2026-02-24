import { useState, useCallback } from "react";
import type { ApiError } from "../api/types";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T, A extends unknown[]>(
  apiFunction: (...args: A) => Promise<T>
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (...args: A): Promise<T | null> => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const data = await apiFunction(...args);

        setState({
          data,
          loading: false,
          error: null,
        });

        return data;
      } catch (err) {
        const error = err as ApiError;

        setState({
          data: null,
          loading: false,
          error,
        });

        return null;
      }
    },
    [apiFunction]
  );

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  return { ...state, request, reset };
}
