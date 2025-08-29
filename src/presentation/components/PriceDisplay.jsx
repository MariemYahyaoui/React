export default function PriceDisplay({ product, best, worst }) {
  return (
    <div className="card mb-3 p-3">
      <div className="d-flex justify-content-between">
        <div>
          <div className="fw-bold">{product.name}</div>
          {product.reference && <div className="text-muted small">Ref: {product.reference}</div>}
        </div>
        <div className="text-end">
          {best ? <div className="text-success">Min: {best.price} €</div> : null}
          {worst ? <div className="text-danger">Max: {worst.price} €</div> : null}
        </div>
      </div>
    </div>
  );
}
