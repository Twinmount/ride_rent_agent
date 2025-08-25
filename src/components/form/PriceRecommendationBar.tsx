type PriceData = {
    assigned?: number;
    avg?: number;
    current?: number;
    low?: number;
    high?: number;
};

type Props = {
    priceData?: PriceData | null;
    onApplyBestPrice?: (value: number) => void;
    className?: string;
    compact?: boolean;
};

export function PriceRecommendationBar({ priceData, onApplyBestPrice, className = "", compact = false }: Props) {
    if (!priceData) return null;

    const bestPrice = priceData.assigned && priceData.assigned > 0
        ? priceData.assigned
        : priceData.avg && priceData.avg > 0
            ? priceData.avg
            : 0;

    if (!bestPrice || bestPrice <= 0) return null;

    return (
        <div className={`mt-2 flex items-center space-x-3 ${className}`}>
            <button
                type="button"
                onClick={() => onApplyBestPrice?.(bestPrice)}
                className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
            >
                Apply Best Price
            </button>
            {!compact && <span className="text-sm text-gray-500">Recommended price</span>}
        </div>
    );
}

export default PriceRecommendationBar;
