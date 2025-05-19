import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";

export default function useGetSearchParams(key: string) {
  const [searchParams] = useSearchParams();
  const value = searchParams.get(key);

  if (!value) {
    toast({
      title: "Error",
      description: "No search params found",
      className: "bg-orange text-white",
    });
    return "";
  }

  return value;
}
