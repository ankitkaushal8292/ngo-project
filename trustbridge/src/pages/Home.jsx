import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [heroImages, setHeroImages] = useState([]); // 🔥 STATIC + NGO images
  const [index, setIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const [campaigns, setCampaigns] = useState([]);
const [loadingCampaign, setLoadingCampaign] = useState(true);

  const [ngos, setNgos] = useState([]);
  const [loadingNGO, setLoadingNGO] = useState(true);

  // login modal
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  /* ================= LOAD HERO IMAGES ================= */
  useEffect(() => {
    const staticImages = [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1600&q=80",
    ];

    fetch("http://localhost:5000/api/ngos/home-photos")
      .then((res) => res.json())
      .then((data) => {
        const ngoImages = data.flatMap((ngo) =>
          ngo.photos.map(
            (photo) => `http://localhost:5000/uploads/${photo}`
          )
        );

        setHeroImages([...staticImages, ...ngoImages]);
      })
      .catch(() => setHeroImages(staticImages));
  }, []);

  /* ================= HERO AUTO SLIDER ================= */
  useEffect(() => {
    if (heroImages.length === 0) return;

    const slide = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(slide);
  }, [heroImages]);

  /* ================= FETCH VERIFIED NGOs ================= */
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ngos/approved");
        const data = await res.json();
        setNgos(res.ok ? data : []);
      } catch {
        setNgos([]);
      } finally {
        setLoadingNGO(false);
      }
    };

    fetchNGOs();
  }, []);

  /* ================= FETCH CAMPAIGNS ================= */
useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/campaigns");
      const data = await res.json();
      setCampaigns(res.ok ? data : []);
    } catch {
      setCampaigns([]);
    } finally {
      setLoadingCampaign(false);
    }
  };

  fetchCampaigns();
}, []);

  /* ================= SHOW LOGIN AFTER 5 SEC ================= */
  useEffect(() => {
    if (sessionStorage.getItem("role")) return;
    const timer = setTimeout(() => setShowLogin(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  /* ================= LOGIN HANDLER ================= */
  const handleLogin = async () => {
    if (!role) return alert("Select role");

    if (role === "admin") {
      if (
        identifier === "admin@trustbridge.com" &&
        password === "admin123"
      ) {
        sessionStorage.setItem("role", "admin");
        setShowLogin(false);
        navigate("/admin-dashboard");
      } else alert("Invalid admin credentials");
      return;
    }

    if (role === "donor") {
     sessionStorage.setItem("role", "donor");
      setShowLogin(false);
      return;
    }

    if (role === "ngo") {
      if (!identifier || !password)
        return alert("Enter registration number & password");

      const res = await fetch("http://localhost:5000/api/ngos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationNumber: identifier,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

sessionStorage.setItem("role", "ngo");
sessionStorage.setItem("ngoId", data.ngo._id);
      setShowLogin(false);
      navigate(`/ngo-dashboard/${data.ngo._id}`);
    }
  };

  const handleDonate = async (campaign) => {

const role = sessionStorage.getItem("role")

if(!role){
alert("Please login to donate")
setShowLogin(true)
return
}

const amount = prompt("Enter donation amount")

if(!amount || amount <= 0) return

await fetch("http://localhost:5000/api/donations/donate",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
amount,
campaignId:campaign._id,
ngoId:campaign.ngoId
})

})

alert("Donation successful 🎉")

}

  return (
    <>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${heroImages[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          transition: "1s ease-in-out",
          filter: showLogin ? "blur(6px)" : "none",
        }}
      >
        <div style={styles.overlay}></div>

        <div style={styles.heroCard}>
          <h1>
            Verified NGOs <br /> Transparent Donations
          </h1>
          <p>NGOs are verified by admin and donors can track real impact.</p>

          <div style={styles.heroTags}>
            <span>✔ Admin Verified</span>
            <span>✔ Proof Based</span>
            <span>✔ 100% Transparency</span>
          </div>
        </div>
      </div>

      

      {/* ================= VERIFIED NGOs ================= */}
      <section style={{ padding: "80px 60px", background: "#f9fafb" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Verified NGOs
        </h2>

        {loadingNGO && <p style={{ textAlign: "center" }}>Loading...</p>}

        {!loadingNGO && ngos.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
           {ngos.map((ngo) => (
  <div
    key={ngo._id}
    onClick={() => navigate(`/ngo-profile/${ngo._id}`)}  // ✅ FIXED
    style={styles.ngoCard}
  >
    <h3>{ngo.name}</h3>
    <p>{ngo.type}</p>
    <p>{ngo.address}</p>
    <span style={styles.badge}>✔ Verified</span>
  </div>
))}
          </div>
        )}
      </section>

      {/* ================= ACTIVE CAMPAIGNS ================= */}
<section style={{ padding: "80px 60px", background: "#ffffff" }}>
  <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
    Active Campaigns
  </h2>

  {loadingCampaign && (
    <p style={{ textAlign: "center" }}>Loading campaigns...</p>
  )}

  {!loadingCampaign && campaigns.length > 0 && (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
      }}
    >
    {campaigns.map((campaign) => (
  <div key={campaign._id} style={styles.campaignCard}>
    <img
      src={`http://localhost:5000/uploads/${campaign.image}`}
      alt={campaign.title}
      style={styles.campaignImage}
    />

    <div style={{ padding: "15px" }}>
      <h3>{campaign.title}</h3>
      <p>{campaign.description}</p>

      <p>
        <b>Target:</b> ₹ {campaign.targetAmount}
      </p>

      {/* 🔥 DONATE BUTTON */}
{sessionStorage.getItem("role") === "donor" && (
  <button
    onClick={() =>
      navigate(`/ngo-profile/${campaign.ngoId}`)
    }
    style={styles.donateBtn}
  >
    DONATE
  </button>
)}
    </div>
  </div>
))}
    </div>
  )}
</section>

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && (
        <div style={styles.modalWrap}>
          <div style={styles.modal}>
            <button style={styles.close} onClick={() => setShowLogin(false)}>
              ✖
            </button>

            <h2>Login</h2>

            <input
              style={styles.input}
              placeholder={role === "ngo" ? "Registration Number" : "Email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
              <option value="admin">Admin</option>
            </select>

            <button style={styles.loginBtn} onClick={handleLogin}>
              Login
            </button>
           <p
  style={styles.signupText}
  onClick={() => {
    setShowLogin(false);
    navigate("/signup");
  }}
>
  Don't have an account? <span style={{color:"#16a34a", fontWeight:"600"}}>Create Account</span>
</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Home;

/* ================= STYLES ================= */
const styles = {
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
  },
  heroCard: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    background: "rgba(0,0,0,0.55)",
    padding: "40px",
    borderRadius: "20px",
    color: "white",
    textAlign: "center",
  },
  heroTags: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  ngoCard: {
    background: "white",
    padding: "22px",
    borderRadius: "18px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
  badge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "6px 14px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
  },
 modalWrap: {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.55)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
},

  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "320px",
  },
  close: {
    float: "right",
    border: "none",
    background: "none",
    fontSize: "18px",
  },
 input: {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  boxSizing: "border-box",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
},
  loginBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
  },

  campaignCard: {
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
},

campaignImage: {
  width: "100%",
  height: "250px",
  objectFit: "cover",   // 🔥 important
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
},
donateBtn: {
  marginTop: "12px",
  width: "100%",
  padding: "10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
  donateBtnHover:{
background:"#dc2626"
}
},
signupText: {
  marginTop: "12px",
  textAlign: "center",
  fontSize: "14px",
  color: "#6b7280",
  cursor: "pointer",
},

};
