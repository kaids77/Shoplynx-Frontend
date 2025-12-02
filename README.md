# ShopLynx E-commerce Frontend

A modern, full-featured e-commerce application built with Next.js 15, featuring a clean UI, shopping cart functionality, user authentication, and admin panel.

## Features

### User Features
- **Product Browsing**: Browse all products with detailed information including stock availability
- **Product Details**: View individual product pages with descriptions, pricing, and stock levels
- **Shopping Cart**: Add/remove items, view cart summary
- **User Authentication**: Register, login, and manage user sessions
- **User Profile**: Update profile information, change password, upload profile picture
- **Order Management**: View order history and transaction details
- **Checkout**: Complete purchases with customer information

### Admin Features
- **Admin Dashboard**: Overview of products, orders, and customers
- **Product Management**: Create, edit, and delete products with image uploads
- **Order Management**: View all orders and update order status
- **Customer Management**: View registered users and their information

### UI/UX Features
- **Responsive Design**: Mobile-friendly interface
- **Stock Indicators**: Real-time stock availability display
- **Out of Stock Handling**: Disabled add-to-cart for unavailable items
- **Dynamic Navigation**: Context-aware navigation based on user role
- **Clean Admin Interface**: Separate admin panel with dedicated navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: CSS (Custom styles)
- **State Management**: React Context API
- **Authentication**: Token-based (Laravel Sanctum)
- **HTTP Client**: Fetch API

## Prerequisites

- Node.js 18+ and npm
- ShopLynx Backend API running on `http://localhost:8000`
- Modern web browser

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kaids77/Shoplynx-Ecommerce.git
   cd shoplynx-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if different from default)
   - The backend API URL is set to `http://localhost:8000` by default
   - Update API calls in context files if your backend runs on a different URL

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Default Admin Account

- **Email**: `admin@shoplynx.com`
- **Password**: `password123`

The admin user is automatically redirected to the admin panel upon login.

## Project Structure

```
shoplynx-frontend/
├── public/
│   └── images/          # Product and profile images
├── src/
│   ├── app/
│   │   ├── admin/       # Admin panel pages
│   │   │   ├── customers/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── layout.js
│   │   ├── products/    # Product pages
│   │   ├── cart/        # Shopping cart
│   │   ├── checkout/    # Checkout page
│   │   ├── orders/      # Order history
│   │   ├── profile/     # User profile
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   └── layout.js    # Root layout
│   ├── components/      # Reusable components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ProductCard.js
│   │   └── AddToCartButton.js
│   └── context/         # React Context providers
│       ├── AuthContext.js
│       └── CartContext.js
└── package.json
```

## Key Components

### Context Providers

- **AuthContext**: Manages user authentication, login, logout, and user state
- **CartContext**: Handles shopping cart operations (add, remove, clear)

### Pages

- **Landing Page** (`/`): Public homepage with featured products
- **Home** (`/home`): Authenticated user homepage
- **Products** (`/products`): Product listing page
- **Product Detail** (`/products/[id]`): Individual product page
- **Cart** (`/cart`): Shopping cart page
- **Checkout** (`/checkout`): Order checkout
- **Profile** (`/profile`): User profile management
- **Admin Dashboard** (`/admin`): Admin overview
- **Admin Products** (`/admin/products`): Product management
- **Admin Orders** (`/admin/orders`): Order management
- **Admin Customers** (`/admin/customers`): Customer list

## Authentication Flow

1. User registers or logs in
2. Backend returns access token
3. Token stored in localStorage
4. Token sent with authenticated requests
5. Admin users redirected to `/admin`, regular users to `/home`

## Shopping Cart

- Cart state managed via CartContext
- Persists across page navigation
- Displays item count in navbar
- Supports add/remove operations

## Product Features

- **Stock Display**: Shows available quantity
- **Low Stock Warning**: Alerts when stock ≤ 5
- **Out of Stock**: Disables purchase when stock = 0
- **Image Upload**: Admin can upload product images
- **Price Display**: Formatted currency (₱)

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## API Integration

The frontend communicates with the Laravel backend API:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Bearer token in Authorization header
- **Endpoints**:
  - `/login`, `/register`, `/logout`
  - `/products`, `/products/{id}`
  - `/cart`, `/orders`
  - `/admin/users`, `/admin/orders`

## Environment Variables

Currently, API endpoints are hardcoded. For production, consider using environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Responsive Design

- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly interface
- Optimized images

## Known Limitations

- API URL is hardcoded (should use environment variables)
- No image optimization (consider next/image)
- Basic error handling (could be enhanced)
- No loading states for async operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Kaids**
- GitHub: [@kaids77](https://github.com/kaids77)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Laravel team for the backend framework
- All contributors and testers

---

**Note**: This is the frontend application. Make sure the [ShopLynx Backend](https://github.com/kaids77/shoplynx-backend) is running before starting this application.
