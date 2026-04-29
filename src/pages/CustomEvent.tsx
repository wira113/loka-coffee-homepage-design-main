// Halaman terpisah untuk fitur Custom Event & Workshop Booking.
// Berisi Navbar di atas, konten CustomEventSection di tengah, dan Footer di bawah.
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomEventSection from "@/components/CustomEventSection";

const CustomEventPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <CustomEventSection />
    <Footer />
  </div>
);

export default CustomEventPage;

