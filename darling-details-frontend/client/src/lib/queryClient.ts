import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// This can keep using fetch for compatibility with existing code
export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  options?: RequestInit
) => {
  const defaultOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const token = localStorage.getItem("authToken");
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      "x-auth-token": token,
    };
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  if (data && method !== "GET") {
    mergedOptions.body = JSON.stringify(data);
  }

  const response = await fetch(url, mergedOptions);
  
  if (!response.ok && response.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }
  
  return response;
};

// Add adapter function for compatibility with existing components using tanstack query
export const fetchAdapter = async ({ queryKey }: { queryKey: any[] }) => {
  const [url, params] = queryKey;
  
  try {
    let fullUrl = url;
    
    // If there are query parameters, handle them
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, String(value));
        }
      });
      fullUrl = `${url}?${queryString.toString()}`;
    }
    
    const response = await apiClient.get(fullUrl);
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
