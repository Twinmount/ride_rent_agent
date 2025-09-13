import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { AgentProvider } from "./context/AgentContext";
import { toast } from "./components/ui/use-toast";
import LazyLoader from "./components/loading-skelton/LazyLoader";
import { HelmetProvider } from "react-helmet-async";
import RouteErrorBoundary from "./layout/RouteErrorBoundary";
import { router } from "./routes/routerConfig";
import { MantineProvider } from "@mantine/core";


const appCountry = localStorage.getItem("appCountry") || "ae";

axios.defaults.baseURL =
  appCountry === "in"
    ? import.meta.env.VITE_API_URL_INDIA
    : import.meta.env.VITE_API_URL_UAE;


const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AgentProvider>
        <RouteErrorBoundary>
          <Suspense fallback={<LazyLoader />}>
            <HelmetProvider>
              <MantineProvider>
                <RouterProvider router={router} />
              </MantineProvider>
            </HelmetProvider>
          </Suspense>
        </RouteErrorBoundary>
      </AgentProvider>
    </QueryClientProvider>
  );
}
