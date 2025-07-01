import { FileText, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

export default function SRMDashboardTaxAndContractSection() {
  const baseClass =
    "gap-x-2 h-14 w-10 w-full rounded-lg p-4 shadow-lg flex items-center justify-between text-black bg-white transition-colors cursor-pointer hover:bg-gray-100 border";

  const iconClass = "h-5 w-5 text-yellow";

  return (
    <section className="mt-10 border-t-2 pt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Tax Info & Contracts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/srm/tax-info/edit" className={baseClass}>
          Tax Info
          <Receipt className={iconClass} />
        </Link>
        <Link to="/srm/contracts/edit" className={baseClass}>
          Contract
          <FileText className={iconClass} />
        </Link>
      </div>
    </section>
  );
}
