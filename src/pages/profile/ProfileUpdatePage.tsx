import { getCompany } from "@/api/company";
import FloatingWhatsAppButton from "@/components/FloatingWhatsappIcon";
import CompanyProfileUpdateForm from "@/components/form/main-form/company-form/CompanyProfileUpdateForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import { useAgentContext } from "@/context/AgentContext";
import { useCompanyCountry } from "@/hooks/useCompanyCountry";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ProfileUpdatePage() {
  const { userId } = useAgentContext();

  const { agentId } = useParams<{ agentId: string }>();

  // Query to get company data
  const { data, isLoading } = useQuery({
    queryKey: ["company", agentId],
    queryFn: () => getCompany(userId as string),
  });

  const { data: countryData, isLoading: isLoadingCountry } =
    useCompanyCountry(userId);

  const country = countryData?.result || "UAE";

  const isIndividual =
    !!data?.result?.accountType && data?.result?.accountType === "individual";

  return (
    <section className="py-5 pt-10 pb-24">
      <h1 className="text-3xl font-bold text-center">
        {isIndividual ? "Update Owner Details" : "Update Company"}
      </h1>
      <h2 className="my-3 text-base text-center text-gray-500">
        Provide your updated details{!isIndividual && " about the company"}.
      </h2>

      {isLoading || isLoadingCountry ? (
        <FormSkelton />
      ) : (
        <CompanyProfileUpdateForm
          formData={data?.result || null}
          agentId={agentId as string}
          country={country}
        />
      )}

      {/* whatsapp floating button */}
      <FloatingWhatsAppButton />
    </section>
  );
}
