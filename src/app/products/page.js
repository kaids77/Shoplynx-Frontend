import ProductCard from '../../components/ProductCard';

async function getProducts() {
    try {
        const res = await fetch('http://localhost:8000/api/products', { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="container mt-5">
            <h1 className="section-title">All Products</h1>
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center">No products found.</p>
                )}
            </div>
        </div>
    );
}
