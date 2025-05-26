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

const appSuportedCountries = [
  {
    id: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48",
    name: "UAE",
    value: "ae",
    icon: "/assets/icons/country-flags/uae-flag.png",
  },
  {
    id: "68ea1314-08ed-4bba-a2b1-af549946523d",
    name: "India",
    value: "in",
    icon: "/assets/icons/country-flags/india-flag.png",
  },
];

type AppState = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  agentId: string;
};

const AgentProvider = ({ children }: AgentProviderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [appCountry, setAppCountry] = useState<string>(() => {
    return localStorage.getItem("appCountry") || appSuportedCountries[0].value;
  });
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

  useEffect(() => {
    if (!localStorage.getItem("appCountry")) {
      localStorage.setItem("appCountry", appSuportedCountries[0].value);
    }
  }, [appCountry]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const updateAppCountry = (newCountry: string) => {
    setAppCountry(newCountry);
    localStorage.setItem("appCountry", newCountry);
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
        appCountry,
        updateAppCountry,
        appSuportedCountries,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export { useAgentContext, AgentProvider };
