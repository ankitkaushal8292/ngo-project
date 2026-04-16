import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      <div style={styles.container}>

      
        <div style={styles.hero}>
          <div style={styles.overlay}>
            <h1>About TrustBridge</h1>
            <p>Connecting donors with trusted NGOs through transparency and impact.</p>
          </div>
        </div>

   
        <div style={styles.content}>

          <div style={styles.card}>
            <h2>🌍 Our Mission</h2>
            <p>
              Our mission is to build trust between donors and NGOs by providing
              a transparent and reliable platform for donations.
            </p>
          </div>

          <div style={styles.card}>
            <h2>🤝 What We Do</h2>
            <p>
              We verify NGOs, track donations, and ensure that every contribution
              reaches the right place with proof and accountability.
            </p>
          </div>

          <div style={styles.card}>
            <h2>🚀 Why Choose Us</h2>
            <ul>
              <li>✔ Verified NGOs</li>
              <li>✔ Transparent donations</li>
              <li>✔ Real impact tracking</li>
            </ul>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "Arial",
    backgroundColor: "#f5f5f5",
  },

  hero: {
    height: "400px",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1542810634-71277d95dcbb')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    color: "white",
   
  },

  content: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "50px",
  },

card: {
  background: "#efebe9",  
  color: "#3e2723",
  padding: "20px",
  borderRadius: "15px",
  width: "300px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
 
}
 
};