import { useEffect, useState } from "react";
import { useSelectedProducts } from '../../providers/SelectProductsContext';
import { compareProducts } from "../../../application/usecases/compareProducts";
import PriceDisplay from "../../components/PriceDisplay";
import PriceComparisonTable from "../../components/PriceComparisonTable";
import PriceHistoryChart from "../../components/PriceHistoryChart";
import { useNavigate } from "react-router-dom";

export default function ComparisonPage() {
  const { selectedProducts } = useSelectedProducts(); // lowercase fixed
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!selectedProducts || selectedProducts.length < 2) return;
      try {
        const l = await compareProducts(selectedProducts[0].id);
        const r = await compareProducts(selectedProducts[1].id);
        setLeftData(l);
        setRightData(r);
      } catch (err) {
        setError(err.message || "Comparison error");
      }
    }
    load();
  }, [selectedProducts]);

  if (!selectedProducts || selectedProducts.length < 2) {
    return (
      <div className="p-3">
        <div className="alert alert-warning">Select two products on the Home page to compare.</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-6">
          <PriceDisplay product={selectedProducts[0]} best={leftData?.best} worst={leftData?.worst} />
          <PriceComparisonTable prices={leftData?.prices || []} best={leftData?.best} worst={leftData?.worst} />
          <PriceHistoryChart chartData={leftData?.chartData || []} />
        </div>

        <div className="col-md-6">
          <PriceDisplay product={selectedProducts[1]} best={rightData?.best} worst={rightData?.worst} />
          <PriceComparisonTable prices={rightData?.prices || []} best={rightData?.best} worst={rightData?.worst} />
          <PriceHistoryChart chartData={rightData?.chartData || []} />
        </div>
      </div>
    </div>
  );
}
