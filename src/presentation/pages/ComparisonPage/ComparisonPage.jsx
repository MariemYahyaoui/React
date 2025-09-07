import { useEffect, useState } from "react";
import { useSelectedProducts } from '../../providers/SelectProductsContext';
import { compareProducts } from "../../../application/usecases/compareProducts";
import PriceDisplay from "../../components/PriceDisplay";
import PriceComparisonTable from "../../components/PriceComparisonTable";
import PriceHistoryChart from "../../components/PriceHistoryChart";
import { useNavigate } from "react-router-dom";

export default function ComparisonPage() {
  const { selectedProducts } = useSelectedProducts();
  const [productsData, setProductsData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!selectedProducts || selectedProducts.length === 0) return;
      setLoading(true);
      setError("");
      try {
        const dataPromises = selectedProducts.map(p => compareProducts(p.id));
        const results = await Promise.all(dataPromises);
        setProductsData(results);
      } catch (err) {
        console.error(err);
        setError(err.message || "Comparison error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedProducts]);

  if (!selectedProducts || selectedProducts.length === 0) {
    return (
      <div className="p-3">
        <div className="alert alert-warning">
          Select products on the Home page to compare.
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  if (loading) return <div className="p-3">Loading comparison...</div>;

  return (
    <div className="p-3">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {productsData.map((data, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
            {data ? (
              <>
                <PriceDisplay
                  product={selectedProducts[index]}
                  best={data.best}
                  worst={data.worst}
                />
                <PriceComparisonTable
                  prices={data.prices}
                  best={data.best}
                  worst={data.worst}
                />
                <PriceHistoryChart chartData={data.chartData} />
              </>
            ) : (
              <div className="alert alert-warning">
                No price data available for {selectedProducts[index].name}.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
