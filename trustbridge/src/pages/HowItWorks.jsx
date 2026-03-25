import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "60px" }}>
        <h1>How It Works</h1>
        <ol>
          <li>NGO registers & gets verified</li>
          <li>NGO uploads proof</li>
          <li>Donor donates with trust</li>
        </ol>
      </div>
      <Footer />
    </>
  );
}
