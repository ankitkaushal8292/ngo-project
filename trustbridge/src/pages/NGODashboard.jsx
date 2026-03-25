import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NGODashboard() {

  const { id } = useParams();
  const ngoId = id;
  const navigate = useNavigate();

  const [donations,setDonations] = useState([])
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [myCampaigns, setMyCampaigns] = useState([]);

  const [bill,setBill] = useState(null)

  useEffect(() => {
    if (!ngoId) navigate("/");
  }, [ngoId, navigate]);

  const fetchNGO = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/ngos/${ngoId}`);
      const data = await res.json();
      setNgo(data);
    } catch {
      alert("Unable to load NGO");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGO();
  }, []);

  /* ================= FETCH DONATIONS ================= */

  useEffect(() => {

    const fetchDonations = async () => {

      try{
        const res = await fetch(
        `http://localhost:5000/api/donations/ngo/${ngoId}`
        )

        const data = await res.json()

        setDonations(data)

      }catch(err){
        console.log("Donation fetch error")
      }

    }

    fetchDonations()

  }, [ngoId])

  /* ================= CREATE CAMPAIGN ================= */

  const handleCreateCampaign = async () => {

    if (!title || !description || !target || !imageFile) {
      return alert("All fields required");
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("targetAmount", target);
    formData.append("ngoId", ngoId);
    formData.append("image", imageFile);

    try {

      const res = await fetch(
        "http://localhost:5000/api/campaigns/create",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Campaign creation failed");
      }

      alert("Campaign created successfully 🎉");

      setMyCampaigns((prev) => [data.campaign, ...prev]);

      setTitle("");
      setDescription("");
      setTarget("");
      setImageFile(null);

    } catch {

      alert("Server error");

    }

  };

  /* ================= FETCH CAMPAIGNS ================= */

  useEffect(() => {

    const fetchCampaigns = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/campaigns");

        const data = await res.json();

        const filtered = data.filter((c) => c.ngoId === ngoId);

        setMyCampaigns(filtered);

      } catch {

        console.error("Campaign fetch error");

      }

    };

    fetchCampaigns();

  }, [ngoId]);

  const handleDeleteCampaign = async (id) => {

    if (!window.confirm("Delete this campaign?")) return;

    try {

      await fetch(
        `http://localhost:5000/api/campaigns/${id}`,
        { method: "DELETE" }
      );

      setMyCampaigns((prev) =>
        prev.filter((campaign) => campaign._id !== id)
      );

      alert("Campaign deleted");

    } catch {

      alert("Delete failed");

    }

  };

  // file upload function 

  const uploadBill = async()=>{

 if(!bill){
 alert("Select bill image")
 return
 }

 const formData = new FormData()

 formData.append("bill",bill)
 formData.append("campaignId",campaignId)
 formData.append("ngoId",ngoId)

 await fetch("http://localhost:5000/api/bills/upload",{

 method:"POST",
 body:formData

 })

 alert("Bill uploaded")
}

  return (

    <>
      <Navbar />

      <div style={styles.page}>

        {loading && <p>Loading...</p>}

        {!loading && ngo && (
          <>

            {/* ================= NGO PROFILE ================= */}

            <div style={styles.profileCard}>

              <img
                src={
                  ngo.profileImage
                    ? `http://localhost:5000/uploads/${ngo.profileImage}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="ngo"
                style={styles.profileImg}
              />

              <div>
                <h2>{ngo.name}</h2>
                <p>{ngo.address}</p>
                <p>{ngo.type}</p>
              </div>

            </div>


            {/* ================= CREATE CAMPAIGN ================= */}

            <div style={styles.campaignSection}>

              <h2>Create Campaign</h2>

              <input
                type="text"
                placeholder="Campaign Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />

              <textarea
                placeholder="Campaign Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
              />

              <input
                type="number"
                placeholder="Target Amount"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={styles.input}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />

              <button
                onClick={handleCreateCampaign}
                style={styles.createBtn}
              >
                Create Campaign
              </button>

            </div>

<h3>Upload Expense Bill</h3>

<input
 type="file"
 onChange={(e)=>setBill(e.target.files[0])}
/>

<button onClick={uploadBill}>
 Upload Bill
</button>

            {/* ================= MY CAMPAIGNS ================= */}

            <h2 style={{ marginTop: "50px" }}>My Campaigns</h2>

            {myCampaigns.length === 0 && <p>No campaigns yet</p>}

            <div style={styles.campaignGrid}>

              {myCampaigns.map((c) => (

                <div key={c._id} style={styles.campaignCard}>

                  <img
                    src={`http://localhost:5000/uploads/${c.image}`}
                    alt={c.title}
                    style={styles.campaignImage}
                  />

                  <h3>{c.title}</h3>

                  <p>{c.description}</p>

                  <button
                    onClick={() =>
                      handleDeleteCampaign(c._id)
                    }
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>


            {/* ================= NGO WORK GALLERY ================= */}

            <h2 style={{ marginTop: "60px" }}>NGO Work Gallery</h2>

            <div style={styles.gallery}>

              {ngo.photos && ngo.photos.map((img,index)=>(

                <img
                  key={index}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt="ngo work"
                  style={styles.galleryImg}
                />

              ))}

            </div>

          </>
        )}

      </div>

      <Footer />
    </>

  );

}

export default NGODashboard;


/* ================= STYLES ================= */

const styles = {

  page:{
    padding:"60px",
    maxWidth:"1200px",
    margin:"auto"
  },

  profileCard:{
    display:"flex",
    alignItems:"center",
    gap:"20px",
    background:"#fff",
    padding:"20px",
    borderRadius:"12px",
    boxShadow:"0 10px 30px rgba(0,0,0,0.08)",
    marginBottom:"40px"
  },

  profileImg:{
    width:"80px",
    height:"80px",
    borderRadius:"50%",
    objectFit:"cover"
  },

  campaignSection:{
    padding:"30px",
    background:"#ffffff",
    borderRadius:"12px",
    boxShadow:"0 10px 30px rgba(0,0,0,0.08)"
  },

  input:{
    width:"100%",
    padding:"10px",
    marginBottom:"10px"
  },

  textarea:{
    width:"100%",
    minHeight:"80px",
    marginBottom:"10px"
  },

  createBtn:{
    marginTop:"10px",
    padding:"12px",
    background:"#16a34a",
    color:"#fff",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer"
  },

  campaignGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
    gap:"20px"
  },

  campaignCard:{
    padding:"20px",
    background:"#fff",
    borderRadius:"12px",
    boxShadow:"0 10px 25px rgba(0,0,0,0.08)"
  },

  campaignImage:{
    width:"100%",
    height:"200px",
    objectFit:"cover",
    borderRadius:"8px"
  },

  deleteBtn:{
    marginTop:"10px",
    padding:"8px",
    background:"#dc2626",
    color:"white",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer"
  },

  gallery:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
    gap:"20px",
    marginTop:"20px"
  },

  galleryImg:{
    width:"100%",
    height:"180px",
    objectFit:"cover",
    borderRadius:"10px"
  }

};