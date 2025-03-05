import { ShieldCheck } from "lucide-react";

export default function AgentId({ agentId }: { agentId: string }) {
  return (
    <div className="flex mb-2 w-full max-sm:flex-col">
      <div className="ml-2 mt-4 flex w-72 justify-between text-base font-semibold lg:text-lg">
        Your Agent Id <span className="mr-5 max-sm:hidden">:</span>
      </div>
      <div className="flex items-center mt-4 w-full text-lg font-semibold text-gray-500 cursor-default">
        {agentId} <ShieldCheck className="ml-3 text-green-500" size={20} />
      </div>
    </div>
  );
}
