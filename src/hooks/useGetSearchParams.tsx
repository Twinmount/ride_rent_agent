import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function useGetSearchParams(key: string) {
  const [searchParams] = useSearchParams();
  const value = searchParams.get(key);

  useEffect(() => {
    if (!value) {
      toast({
        title: "Missing query param",
        description: `${key} query param is required`,
        className: "bg-orange text-white",
      });
    }
  }, [key, value]);

  return value;
}
