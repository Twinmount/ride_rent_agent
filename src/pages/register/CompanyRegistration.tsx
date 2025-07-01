import FloatingWhatsAppButton from "@/components/FloatingWhatsappIcon";
import CompanyForm from "@/components/form/main-form/company-form/CompanyForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import { useAgentContext } from "@/context/AgentContext";
import { useCompanyCountry } from "@/hooks/useCompanyCountry";

export default function CompanyRegistration() {
  const {
    appState: { agentId, userId },
    isLoading,
    isError,
  } = useAgentContext();

  const { data: countryData, isLoading: isLoadingCountry } =
    useCompanyCountry(userId);

  const country = countryData?.result || "UAE";

  return (
    <section className="py-5 pt-10 pb-24">
      <h1 className="text-3xl font-bold text-center">Company Details</h1>
      <h2 className="my-3 text-base text-center text-gray-500">
        Provide your company details to complete the registration
      </h2>

      {isLoading || isLoadingCountry ? (
        <FormSkelton />
      ) : !agentId || isError ? (
        <div className="mt-36 text-2xl font-semibold text-center text-red-500">
          failed to fetch your agent id
        </div>
      ) : (
        <CompanyForm country={country} type="Add" agentId={agentId as string} />
      )}

      {/* whatsapp floating button */}
      <FloatingWhatsAppButton />
    </section>
  );
}
