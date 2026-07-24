import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Gallery from "./pages/Gallery";
import Todra from "./pages/Todra";
import Contact from "./pages/Contact";
import Reservation from "./pages/Reservation";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chambres" element={<Rooms />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/todra" element={<Todra />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reserver" element={<Reservation />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
