import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* BRAND */}
        <div style={styles.section}>
          <h2 style={styles.logo}>HelpChain</h2>
          <p style={styles.tagline}>
            Connecting donors with verified NGOs through transparency.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/about" style={styles.link}>About</Link>
          {/* <Link to="/how-it-works" style={styles.link}>How It Works</Link> */}
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>

        {/* TRUST & INFO */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Why HelpChain?</h4>
          <p style={styles.text}>✔ Admin verified NGOs</p>
          <p style={styles.text}>✔ Proof-based donations</p>
          <p style={styles.text}>✔ Transparent impact</p>
        </div>

        {/* CONTACT */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Contact</h4>
          <p style={styles.text}>📧 help@chain.com</p>
          <p style={styles.text}>📞 +91 8284966452</p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={styles.bottom}>
        <p>© 2026 HelpChain. All rights reserved.</p>
        <p style={styles.small}>Built for transparency & trust</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "linear-gradient(135deg, #064e3b, #022c22)",
    color: "#e5e7eb",
    paddingTop: "50px",
    marginTop: "80px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 30px 40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "35px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    color: "white",
    marginBottom: "10px",
  },
  tagline: {
    fontSize: "14px",
    lineHeight: "1.6",
    maxWidth: "260px",
  },
  heading: {
    color: "white",
    marginBottom: "12px",
    fontSize: "16px",
  },
  link: {
    color: "#d1fae5",
    textDecoration: "none",
    marginBottom: "8px",
    fontSize: "14px",
  },
  text: {
    fontSize: "14px",
    marginBottom: "6px",
  },
  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.15)",
    textAlign: "center",
    padding: "15px 10px",
    fontSize: "13px",
    color: "#cbd5e1",
  },
  small: {
    marginTop: "4px",
    fontSize: "12px",
    opacity: 0.8,
  },
};

export default Footer;
