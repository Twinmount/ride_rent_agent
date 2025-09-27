

type Props = {
    priceData?: number | null;
    currentPrice?: number | null;
    onApplyBestPrice?: (value: number) => void;
    className?: string;
    compact?: boolean; // Added compact property to Props type
};

export function PriceRecommendationBar({ priceData, currentPrice, onApplyBestPrice, className = "" }: Props) {
    if (!priceData || !currentPrice) return null;

    const threshold = priceData * 1.05;

    if (currentPrice <= threshold) return null;

    return (
        <div className={`mt-2 flex items-center space-x-3 ${className}`}>
            <button
                type="button"
                onClick={() => onApplyBestPrice?.(priceData)}
                className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
            >
                Apply Best Price : {JSON.stringify(priceData)}
            </button>
        </div>
    );
}

export default PriceRecommendationBar;
