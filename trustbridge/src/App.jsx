import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BrowseNGO from "./pages/BrowseNGO";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NGODetailsForm from "./pages/NGODetailsForm";
import NGODashboard from "./pages/NGODashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";

/* ✅ ADD THESE */
import DonorProfile from "./pages/DonorProfile";
import NGOProfile from "./pages/NGOProfile";
import EditNGOProfile from "./pages/EditNGOProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/ngos" element={<BrowseNGO />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* NGO */}
        <Route path="/ngo-details" element={<NGODetailsForm />} />
<Route path="/ngo-dashboard/:id" element={<NGODashboard />} />

        {/* ✅ REQUIRED FOR NAVBAR */}
       <Route path="/ngo-profile/:id" element={<NGOProfile />} />

       <Route path="/edit-profile/:id" element={<EditNGOProfile />} />

        {/* Donar Profile */}
       <Route path="/donor-profile" element={<DonorProfile />} />
<Route path="/donor-dashboard" element={<DonorDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
