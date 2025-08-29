import FloatingWhatsAppButton from "@/components/FloatingWhatsappIcon";
import IndividualForm from "@/components/form/main-form/company-form/IndividualForm";
import FormSkelton from "@/components/loading-skelton/FormSkelton";
import { useAgentContext } from "@/context/AgentContext";
import { useCompanyCountry } from "@/hooks/useCompanyCountry";
export default function IndividualRegistration() {
  const {
    isLoading,
    isError,
    appState: { agentId, userId },
  } = useAgentContext();

  const { data: countryData, isLoading: isLoadingCountry } =
    useCompanyCountry(userId);

  const country = countryData?.result || "UAE";

  return (
    <section className="py-5 pt-10 pb-24">
      <h1 className="text-3xl font-bold text-center">Owner Details</h1>
      <h2 className="my-3 text-base text-center text-gray-500">
        Provide your details to complete the registration
      </h2>

      {isLoading || isLoadingCountry ? (
        <FormSkelton />
      ) : !agentId || isError || country !== "India" ? (
        <div className="mt-36 text-2xl font-semibold text-center text-red-500">
          {country !== "India"
            ? "Individual register is not activated in you country"
            : "failed to fetch your agent id"}
        </div>
      ) : (
        <IndividualForm
          country={country}
          type="Add"
          agentId={agentId as string}
        />
      )}

      {/* whatsapp floating button */}
      <FloatingWhatsAppButton />
    </section>
  );
}
