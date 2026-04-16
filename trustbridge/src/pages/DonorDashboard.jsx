import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
function DonorDashboard() {
const donor = JSON.parse(localStorage.getItem("donor")) || {};
  const navigate = useNavigate?.(); // safe if needed later

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(donor.name || "");
  const [profileImage, setProfileImage] = useState(null);

  // Dummy donation history (later API se aayega)
  const donations = [
    {
      ngo: "Helping Hands",
      amount: 500,
      date: new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}),
      status: "Success",
    },
    {
      ngo: "Food For All",
      amount: 1000,
      date: "12 Jan 2026",
      status: "Pending",
    },
  ];

  const handleLogout = () => {
   sessionStorage.clear();
localStorage.removeItem("donor");
    window.location.href = "/";
  };

  const handleSaveProfile = () => {
    localStorage.setItem(
      "donor",
      JSON.stringify({
        ...donor,
        name,
      })
    );
    alert("Profile updated successfully");
    setActiveTab("profile");
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* ================= SIDEBAR ================= */}
        <aside style={styles.sidebar}>
          <div style={styles.avatar}>
            {donor.name?.charAt(0)?.toUpperCase() || "D"}
          </div>

          <h3>{donor.name}</h3>
          <p style={styles.role}>Donor</p>

          <div style={styles.menu}>
            <button
              style={tabStyle(activeTab === "profile")}
              onClick={() => setActiveTab("profile")}
            >
              👤 My Profile
            </button>

            <button
              style={tabStyle(activeTab === "edit")}
              onClick={() => setActiveTab("edit")}
            >
              ✏️ Edit Profile
            </button>

            <button
              style={tabStyle(activeTab === "donations")}
              onClick={() => setActiveTab("donations")}
            >
              ❤️ Donation History
            </button>

            <button style={styles.logout} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main style={styles.main}>
          {/* ===== PROFILE ===== */}
          {activeTab === "profile" && (
            <>
              <h2>👤 My Profile</h2>

              <div style={styles.card}>
                <p><b>Name:</b> {donor.name}</p>
                <p><b>Email:</b> {donor.email}</p>
                <p><b>Role:</b> Donor</p>
               <p><b>Joined Date:</b> {new Date().toLocaleDateString()}</p>

                <hr />

                <p><b>Total Donations:</b> {donations.length}</p>
                <p><b>Last Donation:</b> {donations[0]?.date || "N/A"}</p>
              </div>
            </>
          )}

          {/* ===== EDIT PROFILE ===== */}
          {activeTab === "edit" && (
            <>
              <h2>✏️ Edit Profile</h2>

              <div style={styles.card}>
                <label>Name</label>
                <input
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label>Email</label>
                <input
                  style={{ ...styles.input, background: "#f3f4f6" }}
                  value={donor.email}
                  readOnly
                />

                <label>Change Password (optional)</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="New password"
                />

                <button style={styles.saveBtn} onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>
            </>
          )}

          {/* ===== DONATION HISTORY ===== */}
          {activeTab === "donations" && (
            <>
              <h2>❤️ Donation History</h2>

              {donations.length === 0 ? (
                <p>No donations yet</p>
              ) : (
                <div style={styles.table}>
                  {donations.map((d, i) => (
                    <div key={i} style={styles.row}>
                      <span>{d.ngo}</span>
                      <span>₹{d.amount}</span>
                      <span>{d.date}</span>
                      <span
                        style={{
                          color:
                            d.status === "Success" ? "#16a34a" : "#ca8a04",
                          fontWeight: "600",
                        }}
                      >
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default DonorDashboard;

/* ================= STYLES ================= */

const styles = {
  page: {
    display: "flex",
    gap: "30px",
    padding: "30px",
    background: "#f9fafb",
    minHeight: "80vh",
  },

  sidebar: {
    width: "260px",
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#9333ea",
    color: "white",
    fontSize: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
  },

  role: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  logout: {
    marginTop: "20px",
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    height: "42px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    padding: "0 12px",
  },

  saveBtn: {
    marginTop: "10px",
    height: "44px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
  },

  table: {
    background: "white",
    marginTop: "15px",
    borderRadius: "14px",
    padding: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },
};

const tabStyle = (active) => ({
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: active ? "#ede9fe" : "#f9fafb",
  cursor: "pointer",
  fontWeight: active ? "600" : "400",
});
