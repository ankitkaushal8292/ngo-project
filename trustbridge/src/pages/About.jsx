import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "60px" }}>
        <h1>About TrustBridge</h1>
        <p>This platform builds trust between donors and NGOs.</p>
      </div>
      <Footer />
    </>
  );
}
