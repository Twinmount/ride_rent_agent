import { getCompany } from "@/api/company";
import FloatingWhatsAppButton from "@/components/FloatingWhatsappIcon";
import CompanyProfileUpdateForm from "@/components/form/main-form/CompanyProfileUpdateForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import { DecodedRefreshToken } from "@/layout/ProtectedRoutes";
import { load, StorageKeys } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

export default function ProfileUpdatePage() {
  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN);
  const { userId } = jwtDecode<DecodedRefreshToken>(refreshToken as string);

  const { agentId } = useParams<{ agentId: string }>();

  // Query to get company data
  const { data, isLoading } = useQuery({
    queryKey: ["company", agentId],
    queryFn: () => getCompany(userId),
  });

  return (
    <section className="py-5 pt-10 pb-24">
      <h1 className="text-3xl font-bold text-center">Update Company</h1>
      <h2 className="my-3 text-base text-center text-gray-500">
        Provide your updated details about the company.
      </h2>

      {isLoading ? (
        <FormSkelton />
      ) : (
        <CompanyProfileUpdateForm
          formData={data?.result || null}
          agentId={agentId as string}
        />
      )}

      {/* whatsapp floating button */}
      <FloatingWhatsAppButton />
    </section>
  );
}
