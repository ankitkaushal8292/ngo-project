import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();

  // STATES
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SIGNUP HANDLER
const handleSignup = () => {
  if (!name || !email || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  // ✅ COMMON AUTH
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", role);

  // ================= NGO SIGNUP =================
  if (role === "ngo") {
    localStorage.setItem(
      "ngo",
      JSON.stringify({
        name,
        email,
      })
    );

    navigate("/ngo-details"); // ✅ NGO FORM
  }

  // ================= DONOR SIGNUP =================
else if (role === "donor") {
  localStorage.setItem(
    "donor",
    JSON.stringify({
      name,     // 👈 THIS IS MISSING EARLIER
      email,
       joinedAt: new Date().toISOString(),
    })
  );

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", "donor");

  navigate("/"); // ✅ MUST
}

};


  return (
    <div style={styles.container}>
      {/* BACKGROUND OVERLAY */}
      <div style={styles.overlay}></div>

      {/* SIGNUP CARD */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subHeading}>
          Join TrustBridge & make transparent donations
        </p>

        <input
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ROLE SELECT */}
        <select
          style={styles.input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="donor">Donor</option>
          <option value="ngo">NGO</option>
        </select>

        {/* SIGNUP BUTTON */}
        <button style={styles.button} onClick={handleSignup}>
          Sign Up
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1509099836639-18ba1795216d)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom right, rgba(0,0,0,0.75), rgba(22,101,52,0.85))",
  },

  card: {
    position: "relative",
    zIndex: 1,
    width: "420px",
    padding: "40px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
    color: "white",
    textAlign: "center",
  },

  heading: {
    fontSize: "26px",
    marginBottom: "6px",
  },

  subHeading: {
    fontSize: "14px",
    marginBottom: "26px",
    color: "#d1fae5",
  },

  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    marginBottom: "14px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    height: "48px",
    background:
      "linear-gradient(90deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },

  text: {
    marginTop: "18px",
    fontSize: "14px",
  },

  link: {
    color: "#86efac",
    cursor: "pointer",
    fontWeight: "500",
  },
};
