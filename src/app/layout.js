import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Notification from "../components/Notification";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { NotificationProvider } from "../context/NotificationContext";

export const metadata = {
  title: "ShopLynx",
  description: "Your one-stop shop for everything.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <Navbar />
              <Notification />
              <main>{children}</main>
              <Footer />
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
