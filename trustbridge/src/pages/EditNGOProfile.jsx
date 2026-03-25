import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EditNGOProfile() {
  const { id } = useParams();               // 🔥 ngoId from URL
  const navigate = useNavigate();

  const [ngo, setNgo] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH NGO ================= */
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchNGO = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ngos/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error();

        setNgo(data);
        setName(data.name);
      } catch {
        alert("Unable to load NGO data");
      } finally {
        setLoading(false);
      }
    };

    fetchNGO();
  }, [id, navigate]);

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    if (!name && !image) {
      alert("Nothing to update");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    if (name) formData.append("name", name);
    if (image) formData.append("profileImage", image);

    try {
      const res = await fetch(
        `http://localhost:5000/api/ngos/update-profile/${id}`,
        { method: "PUT", body: formData }
      );

      const data = await res.json();
      if (!res.ok) throw new Error();

      // 🔥 sync navbar + cache
      localStorage.setItem("ngo", JSON.stringify(data.ngo));

      alert("Profile updated successfully");
      navigate(`/ngo-profile/${id}`);
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.center}>Loading...</div>
        <Footer />
      </>
    );
  }

  if (!ngo) {
    return (
      <>
        <Navbar />
        <div style={styles.center}>NGO not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Edit Profile</h2>

          <img
            src={
              ngo.profileImage
                ? `http://localhost:5000/uploads/${ngo.profileImage}`
                : "https://via.placeholder.com/120"
            }
            alt="profile"
            style={styles.avatar}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="NGO Name"
            style={styles.input}
          />

          <button onClick={handleUpdate} style={styles.btn} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EditNGOProfile;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "80vh",
    background: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "420px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #16a34a",
    marginBottom: "12px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },

  btn: {
    marginTop: "16px",
    padding: "10px",
    width: "100%",
    borderRadius: "999px",
    background: "#16a34a",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  center: {
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
