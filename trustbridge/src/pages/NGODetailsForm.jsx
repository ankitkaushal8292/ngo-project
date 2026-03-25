import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NGODetailsForm() {
  const navigate = useNavigate();

  const [ngoName, setNgoName] = useState("");
  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");

  const [document, setDocument] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔥 SAFE PHOTO HANDLER */
  const handlePhotosChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 4) {
      alert("You can upload maximum 4 photos only");
      return;
    }

    setPhotos(selectedFiles);
  };

  /* ================= SUBMIT NGO ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !ngoName.trim() ||
      !regNo.trim() ||
      !password.trim() ||
      !type ||
      !address.trim() ||
      !document
    ) {
      alert("Please fill all required details");
      return;
    }

    if (!Array.isArray(photos) || photos.length === 0) {
      alert("Please upload at least 1 NGO photo");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", ngoName.trim());
      formData.append("email", email.trim());
      formData.append("registrationNumber", regNo.trim());
      formData.append("password", password);
      formData.append("type", type);
      formData.append("address", address.trim());
      formData.append("document", document);

      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const res = await fetch("http://localhost:5000/api/ngos/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert(
        "NGO registered successfully.\n\nPlease wait for admin approval, then login."
      );

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <h2>NGO Registration</h2>

          <input style={styles.input} placeholder="NGO Name"
            value={ngoName} onChange={(e) => setNgoName(e.target.value)} />

          <input style={styles.input} type="email"
            placeholder="Official NGO Email (optional)"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <input style={styles.input} placeholder="Registration Number"
            value={regNo} onChange={(e) => setRegNo(e.target.value)} />

          <input style={styles.input} type="password"
            placeholder="Create Password"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          <select style={styles.input} value={type}
            onChange={(e) => setType(e.target.value)}>
            <option value="">Select NGO Type</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Food">Food</option>
            <option value="Women Empowerment">Women Empowerment</option>
          </select>

          <textarea style={styles.textarea} placeholder="NGO Address"
            value={address} onChange={(e) => setAddress(e.target.value)} />

          <label style={styles.label}>Upload Registration Proof</label>
          <input type="file" accept=".pdf,.jpg,.png"
            onChange={(e) => setDocument(e.target.files[0] || null)} />

          <label style={styles.label}>
            Upload NGO Area / Work Photos (Max 4)
          </label>
          <input type="file" multiple accept="image/*"
            onChange={handlePhotosChange} />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default NGODetailsForm;



/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f9fafb",
    padding: "40px",
  },
  card: {
    width: "420px",
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    resize: "none",
    height: "80px",
  },
  label: {
    fontSize: "14px",
    marginTop: "6px",
  },
  btn: {
    marginTop: "12px",
    padding: "12px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
