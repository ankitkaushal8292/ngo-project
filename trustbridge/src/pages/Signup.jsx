import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();

  // BASIC STATES
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // NGO STATES
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [document, setDocument] = useState(null);
  const [photos, setPhotos] = useState([]);

  // SIGNUP HANDLER
  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      setError("All required fields must be filled");
      return;
    }

    try {
      // ================= DONOR =================
      if (role === "donor") {
        const res = await fetch("http://localhost:5000/api/donors/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message);
          return;
        }

        setError("");

// 🔥 ADD THIS
sessionStorage.clear();

sessionStorage.setItem("role", "donor");
localStorage.setItem(
  "donor",
  JSON.stringify({
    name,
    email,
  })
);

navigate("/donor-dashboard");// ya /donor-dashboard agar hai

return; // ❗ VERY IMPORTANT
      }

      // ================= NGO =================
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (!registrationNumber || !address || !document) {
        setError("Please fill all NGO details");
        return;
      }

      formData.append("registrationNumber", registrationNumber);
      formData.append("type", role);
      formData.append("address", address);
      formData.append("document", document);

      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const res = await fetch("http://localhost:5000/api/ngos/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

setError("");

// 🔥 CLEAR OLD DATA
sessionStorage.clear();

// 🔥 SAVE NGO DATA (IMPORTANT)
sessionStorage.setItem("role", "ngo");
sessionStorage.setItem(
  "ngo",
  JSON.stringify({
    name,
    email,
  })
);


sessionStorage.setItem("ngoId", data.ngoId);

navigate(`/ngo-dashboard/${data.ngoId}`);

return;

    } catch (err) {
      console.log(err);
      setError("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

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

        <select
          style={styles.input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="donor">Donor</option>
          <option value="ngo">NGO</option>
        </select>

        {/* NGO EXTRA FIELDS */}
        {role === "ngo" && (
          <>
            <input
              style={styles.input}
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

          {/* 📄 Certificate Upload */}
<div style={styles.fileBox}>
  <span style={styles.fileLabel}>
    📄 Upload Registration Certificate
  </span>
  <input
    type="file"
    onChange={(e) => setDocument(e.target.files[0])}
  />
</div>

{/* 🖼 NGO Photos Upload */}
<div style={styles.fileBox}>
  <span style={styles.fileLabel}>
    🖼 Upload NGO Work Photos (Max 4)
  </span>
  <input
    type="file"
    multiple
    onChange={(e) => setPhotos([...e.target.files])}
  />
</div>
          </>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

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
  display: "block",        
},

  button: {
    width: "100%",
    height: "48px",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  fileBox: {
  textAlign: "left",
  marginBottom: "12px",
},

fileLabel: {
  fontSize: "14px",
  display: "block",
  marginBottom: "5px",
  color: "#d1fae5",
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