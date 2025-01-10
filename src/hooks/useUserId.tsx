import { toast } from "@/components/ui/use-toast";
import { DecodedRefreshToken } from "@/layout/ProtectedRoutes";
import { load, StorageKeys } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function useUserId() {
  const navigate = useNavigate();

  let userId = load<string>(StorageKeys.USER_ID);
  if (!userId) {
    const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        const decodedRefreshToken =
          jwtDecode<DecodedRefreshToken>(refreshToken);
        userId = decodedRefreshToken?.userId;
      } catch (error) {
        console.error("Error decoding the refresh token", error);
        toast({
          variant: "destructive",
          title: "Invalid token! Login to continue",
        });
        navigate("/login", { replace: true });
      }
    }
  }
  return { userId };
}
