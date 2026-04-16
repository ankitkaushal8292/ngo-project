import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const handleSubmit = (e) => {
  e.preventDefault(); 

  alert("Message sent successfully!");
};
  return (
    <>
      <Navbar />

      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <h1>Get in Touch</h1>
          <p>We would love to hear from you. Let's make a difference together.</p>
        </div>

        {/* Main Content */}
        <div style={styles.content}>

          {/* Left Side */}
          <div style={styles.info}>
            <h2>Contact Information</h2>
            <p>📧 support@trustbridge.com</p>
            <p>📞 +91 9876543210</p>
            <p>📍 India</p>
          </div>

          {/* Right Side Form */}
          <div style={styles.formBox}>
            <h2>Send Message</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input type="text" placeholder="Your Name" style={styles.input} required />
              <input type="email" placeholder="Your Email" style={styles.input} required />
              <textarea placeholder="Your Message" rows="5" style={styles.input} required></textarea>
              <button type="submit" style={styles.button}>Send Message</button>
            </form>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f5f5f5",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  content: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  info: {
    flex: 1,
    minWidth: "250px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  formBox: {
    flex: 1,
    minWidth: "300px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "12px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};