import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DonationForm from "../components/DonationForm";

function NGOProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [bills,setBills] = useState([])

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    useEffect(()=>{

fetch("http://localhost:5000/api/bills")
.then(res=>res.json())
.then(data=>{

const filtered = data.filter(b=>b.ngoId===id)

setBills(filtered)

})

},[])

    const fetchNGO = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ngos/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error();
        setNgo(data);
      } catch {
        alert("Unable to load NGO profile");
      } finally {
        setLoading(false);
      }
    };

    fetchNGO();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!ngo) return <div>NGO not found</div>;

  return (
    <>
      <Navbar />

      <div
        style={{
          ...styles.container,
          background: darkMode ? "#0f172a" : "#f3f4f6",
          color: darkMode ? "white" : "black",
        }}
      >
        {/* 🔥 SIDEBAR */}
        <div
          style={{
            ...styles.sidebar,
            width: expanded ? "280px" : "80px",
            background: darkMode ? "#1e293b" : "#ffffff",
          }}
        >
          {/* Toggle Expand */}
          <div style={styles.toggleRow}>
            <button
              onClick={() => setExpanded(!expanded)}
              style={styles.iconBtn}
            >
              {expanded ? "⬅" : "➡"}
            </button>

            {expanded && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={styles.iconBtn}
              >
                {darkMode ? "☀" : "🌙"}
              </button>
            )}
          </div>

          {/* Profile Section */}
          <div style={styles.profileSection}>
            <img
              src={
                ngo.profileImage
                  ? `http://localhost:5000/uploads/${ngo.profileImage}`
                  : "https://via.placeholder.com/80"
              }
              alt="NGO"
              style={styles.avatar}
            />

            {expanded && (
              <>
                <h3>{ngo.name}</h3>
                <p style={{ fontSize: "12px" }}>
                  Reg No: {ngo.registrationNumber}
                </p>
              </>
            )}
          </div>

          {expanded && (
            <>
              <hr />

              <div style={styles.menuItem}>
                <strong>Type:</strong> {ngo.type}
              </div>

              <div style={styles.menuItem}>
                <strong>Email:</strong> {ngo.email || "N/A"}
              </div>

              <div style={styles.menuItem}>
                <strong>Address:</strong> {ngo.address}
              </div>

              <div style={{ marginTop: "20px" }}>
                <span style={styles.status(ngo.status)}>
                  {ngo.status.toUpperCase()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 🔥 RIGHT SIDE CONTENT AREA */}
        <div style={styles.contentArea}>
  <div
    style={{
      display: "flex",
      gap: "40px",
      alignItems: "flex-start",
      flexWrap: "wrap",
    }}
  >
    {/* NGO WORK IMAGE */}
    <div style={{ flex: "1 1 400px" }}>
      <img
        src={
          ngo.photos && ngo.photos.length > 0
            ? `http://localhost:5000/uploads/${ngo.photos[0]}`
            : ngo.profileImage
            ? `http://localhost:5000/uploads/${ngo.profileImage}`
            : "https://via.placeholder.com/500x300"
        }
        alt="ngo work"
        style={{
          width: "100%",
          borderRadius: "16px",
          marginBottom: "20px",
        }}
      />

      <h2>Support {ngo.name}</h2>
      <p>
        Your contribution helps this NGO continue its work in{" "}
        {ngo.type}.
      </p>
    </div>

    {/* DONATION FORM */}
    {sessionStorage.getItem("role") === "donor" && (
  <div style={{ flex: "1 1 350px" }}>
    <DonationForm ngoId={id} />
  </div>
)}

<h3>NGO Bills</h3>

<div style={{display:"flex",gap:"20px"}}>

{bills.map(bill=>(

<img
 key={bill._id}
 src={`http://localhost:5000/uploads/${bill.image}`}
 width="200"
/>

))}

</div>
  </div>
</div>
      </div>

      <Footer />
    </>
  );
}

export default NGOProfile;

/* ================= STYLES ================= */

const styles = {
  container: {
    display: "flex",
    minHeight: "80vh",
    transition: "0.3s",
  },

  sidebar: {
    transition: "0.3s",
    padding: "20px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
  },

  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  iconBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },

  profileSection: {
    textAlign: "center",
    marginBottom: "20px",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },

  menuItem: {
    marginTop: "10px",
    fontSize: "14px",
  },

  contentArea: {
    flex: 1,
    padding: "40px",
  },

  status: (status) => ({
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    color: "white",
    background:
      status === "approved"
        ? "#16a34a"
        : status === "pending"
        ? "#f59e0b"
        : "#dc2626",
  }),
};