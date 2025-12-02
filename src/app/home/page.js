import ProductCard from '../../components/ProductCard';
import Link from 'next/link';

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

export default async function Home() {
    const products = await getProducts();
    const featuredProducts = products.slice(0, 8);

    return (
        <>
            <div className="hero-white">
                <div className="container hero-content">
                    <h1>New Arrivals</h1>
                    <p>Check out our latest collection.</p>
                </div>
            </div>

            <div className="container mt-5">
                <div className="products-grid">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p className="text-center">No products found. Make sure the backend is running.</p>
                    )}
                </div>
                <div className="text-center mb-4">
                    <Link href="/products" className="btn btn-outline">View All Products</Link>
                </div>
            </div>
        </>
    );
}
