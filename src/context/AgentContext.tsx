import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { AgentContextType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { load, StorageKeys } from "@/utils/storage";

const AgentContext = createContext<AgentContextType | null>(null);

const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgentContext must be used within an AppProvider");
  }
  return context;
};

type AgentProviderProps = {
  children: ReactNode;
};

type AppState = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  agentId: string;
};

const AgentProvider = ({ children }: AgentProviderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isSmallScreen = useIsSmallScreen(1100);

  const accessToken = load<string>(StorageKeys.ACCESS_TOKEN);
  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN);

  const [appState, setAppState] = useState<AppState>({
    accessToken: "",
    refreshToken: "",
    userId: "",
    agentId: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", accessToken, refreshToken],
    queryFn: getUser,
    enabled: !!accessToken && !!refreshToken,
  });

  const { agentId, id } = data?.result || {};

  useEffect(() => {
    if (!!agentId && !!id) {
      setAppState((prev) => ({
        ...prev,
        agentId: agentId,
        userId: id,
      }));
    }
  }, [data?.result]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AgentContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isSmallScreen,
        agentId,
        userId: id,
        isLoading,
        isError,
        appState,
        setAppState,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export { useAgentContext, AgentProvider };
