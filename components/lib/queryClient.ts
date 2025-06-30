import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`${res.status}: ${errorText}`);
  }
}

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  body?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => ({ queryKey }: { queryKey: readonly unknown[] }) => Promise<T> = ({
  on401,
}) => {
  return async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const params = queryKey[1] as Record<string, string> | undefined;
    
    let fetchUrl = url;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "All Categories") {
          searchParams.append(key, value);
        }
      });
      if (searchParams.toString()) {
        fetchUrl += `?${searchParams.toString()}`;
      }
    }

    const res = await fetch(fetchUrl, {
      credentials: "include",
    });

    if (res.status === 401) {
      if (on401 === "returnNull") {
        return null;
      }
      throw new Error("Unauthorized");
    }

    await throwIfResNotOk(res);
    return res.json();
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});