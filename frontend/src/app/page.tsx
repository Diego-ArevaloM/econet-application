import { Link } from "react-router-dom";
import HeroSection from "../components/hero-section"
import FeaturedProducts from "../components/featured-products"
import NewProducts from "../components/new-products"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
    <HeroSection />
    <FeaturedProducts />
    <NewProducts />

    </div>
  );
}