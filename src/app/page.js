import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import HeroButtons from '../components/HeroButtons';

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

export default async function LandingPage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4); // Show top 4 on landing

  return (
    <>
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Shoplynx</h1>
            <p>Your premium destination for quality products. Experience the future of shopping with us.</p>
            <HeroButtons />
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Premium Quality</h3>
              <p>We source only the finest materials for our products.</p>
            </div>
            <div className="feature-card">
              <h3>Fast Shipping</h3>
              <p>Get your orders delivered to your doorstep in no time.</p>
            </div>
            <div className="feature-card">
              <h3>Secure Payment</h3>
              <p>Your transactions are safe and encrypted.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
      </div>
    </>
  );
}
