// Halaman beranda yang menggabungkan semua komponen pembuka
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueBar from "@/components/ValueBar";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import CustomEventSection from "@/components/CustomEventSection";
import Categories from "@/components/Categories";
import LatestBlog from "@/components/LatestBlog";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ValueBar />
    <FeaturedProducts />
    <WhyChooseUs />
    <CustomEventSection />
    <Categories />
    <LatestBlog />
    <Testimonials />
    <Footer />
  </div>
);

export default Index;
