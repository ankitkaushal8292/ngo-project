import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function DonorProfile() {
  const donor = JSON.parse(localStorage.getItem("donor"));

  if (!donor) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "100px" }}>
          Please login to view profile
        </p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "80px 60px" }}>
        <h2>👤 My Profile</h2>

        <div style={card}>
          <div style={avatar}>
            {donor.name?.charAt(0).toUpperCase()}
          </div>

          <p><b>Name:</b> {donor.name}</p>
          <p><b>Email:</b> {donor.email}</p>
          <p><b>Role:</b> Donor</p>
          <p>
            <b>Joined:</b>{" "}
            {new Date(donor.joinedAt).toDateString()}
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  maxWidth: "400px",
};

const avatar = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "#9333ea",
  color: "white",
  fontSize: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
};

export default DonorProfile;
