export default function PriceComparisonTable({ prices, best, worst }) {
  return (
    <div className="card mb-3">
      <div className="card-header">Prices by Supplier</div>
      <ul className="list-group list-group-flush">
        {prices.map((p, i) => {
          const isMin = best && p.price === best.price && p.supplierId === best.supplierId;
          const isMax = worst && p.price === worst.price && p.supplierId === worst.supplierId;
          return (
            <li key={i} className={`list-group-item d-flex justify-content-between align-items-center ${isMin ? "bg-success bg-opacity-10" : isMax ? "bg-danger bg-opacity-10" : ""}`}>
              <div>Supplier {p.supplierId}</div>
              <div>{p.price} €</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
