import Link from 'next/link';
import AddToCartButton from '../../../components/AddToCartButton';

async function getProduct(id) {
    try {
        const res = await fetch(`http://localhost:8000/api/products/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function ProductPage({ params }) {
    const { id } = await params;

    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="container mt-5 text-center">
                <h1>Product Not Found</h1>
                <Link href="/products" className="btn btn-primary mt-3">Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <Link href="/products" className="back-button btn btn-outline btn-sm">← Back to Products</Link>
            <div className="product-detail-container">
                <div className="product-detail-image-wrapper">
                    {product.image_path ? (
                        <img src={`/images/${product.image_path}`} alt={product.name} className="product-detail-image" />
                    ) : (
                        <div className="product-detail-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
                            No Image
                        </div>
                    )}
                </div>
                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <p className="product-price-large">₱{parseFloat(product.price).toFixed(2)}</p>
                    <p className="product-stock-info" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        <strong>Stock:</strong> {product.stock || 0} available
                    </p>
                    <div className="product-description">
                        <p>{product.description}</p>
                    </div>
                    <div className="d-flex" style={{ gap: '1rem' }}>
                        <AddToCartButton productId={product.id} className="btn btn-primary btn-lg" disabled={!product.stock || product.stock === 0} />
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-danger mt-3">Only {product.stock} left in stock!</p>
                    )}
                    {product.stock === 0 && (
                        <p className="text-danger mt-3">Out of Stock</p>
                    )}
                </div>
            </div>
        </div>
    );
}
