import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = sessionStorage.getItem("role");
  const isLoggedIn = !!role;

const ngoData =
  role === "ngo" ? JSON.parse(sessionStorage.getItem("ngo")) : null;

 const donorData =
  role === "donor" ? JSON.parse(localStorage.getItem("donor")) : null;

  const ngoId = sessionStorage.getItem("ngoId");

  const handleLogout = () => {
    sessionStorage.clear();
localStorage.removeItem("donor");
localStorage.removeItem("ngo");
    setOpen(false);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <Link to="/" style={styles.logoWrap}>
        <img src={logo} alt="HelpChain Logo" style={styles.logoImg} />
        <span style={styles.logoText}>HelpChain</span>
      </Link>

      {/* LINKS */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
     

        {!isLoggedIn && (
          <Link to="/login" style={styles.signInBtn}>
            Sign In
          </Link>
        )}

        {isLoggedIn && (
          <div style={styles.profileWrap}>
            
            {/* AVATAR */}
            <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
              
              {role === "ngo" && (
                ngoData?.profileImage ? (
                  <img
                    src={`http://localhost:5000/uploads/${ngoData.profileImage}`}
                    alt="NGO"
                    style={styles.profileImage}
                  />
                ) : (
                  <div style={styles.avatar}>
                    {ngoData?.name?.charAt(0)?.toUpperCase() || "H"}
                  </div>
                )
              )}

              {role === "donor" && (
                <div style={{ ...styles.avatar, background: "#9333ea" }}>
                  {donorData?.name?.charAt(0)?.toUpperCase() || "D"}
                </div>
              )}

              {role === "admin" && (
                <div style={{ ...styles.avatar, background: "#1d4ed8" }}>
                  A
                </div>
              )}
            </div>

            {/* DROPDOWN */}
            {open && (
              <div style={styles.dropdown}>

                {role === "ngo" && ngoId && (
                  <>
                    <div
                      style={styles.dropdownItem}
                      onClick={() => {
                        setOpen(false);
                        navigate(`/ngo-dashboard/${ngoId}`);
                      }}
                    >
                      👤 My Dashboard
                    </div>

                    <div
                      style={styles.dropdownItem}
                      onClick={() => {
                        setOpen(false);
                        navigate(`/edit-profile/${ngoId}`);
                      }}
                    >
                      ✏ Edit Profile
                    </div>
                  </>
                )}

                {role === "donor" && (
                  <div
                    style={styles.dropdownItem}
                    onClick={() => {
                      setOpen(false);
                      navigate("/donor-dashboard");
                    }}
                  >
                    👤 Donor Dashboard
                  </div>
                )}

                {role === "admin" && (
                  <div
                    style={styles.dropdownItem}
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin-dashboard");
                    }}
                  >
                    🛠 Admin Dashboard
                  </div>
                )}

                <hr style={styles.hr} />

                <div
                  style={{ ...styles.dropdownItem, color: "#dc2626" }}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


/* ================= STYLES ================= */

const styles = {
  nav: {
    height: "58px",
    padding: "0 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
  },

  logoImg: {
    width: "46px",
    height: "46px",
    objectFit: "contain",
  },

  logoText: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#14532d",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "26px",
    position: "relative",
  },

  link: {
    textDecoration: "none",
    color: "#374151",
    fontSize: "15px",
    fontWeight: "500",
  },

  signInBtn: {
    padding: "8px 20px",
    borderRadius: "999px",
    background: "#16a34a",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },

  profileWrap: {
    position: "relative",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#16a34a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },

  profileImage: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #16a34a",
  },

  dropdown: {
    position: "absolute",
    top: "48px",
    right: "0",
    width: "210px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    padding: "8px",
    zIndex: 200,
  },

  dropdownItem: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  hr: {
    margin: "6px 0",
    border: "none",
    borderTop: "1px solid #e5e7eb",
  },
};
