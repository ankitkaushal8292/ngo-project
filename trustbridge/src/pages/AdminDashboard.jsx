import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import adminImg from "../assets/admin.jpg";

function AdminDashboard() {
  const [selectedNgo, setSelectedNgo] = useState(null);

  const [pendingNgos, setPendingNgos] = useState([]);
  const [approvedNgos, setApprovedNgos] = useState([]);
  const [blockedNgos, setBlockedNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH APIs ================= */
  const fetchPendingNGOs = async () => {
    const res = await fetch("http://localhost:5000/api/ngos/pending");
    setPendingNgos(await res.json());
  };

  const [bills,setBills] = useState([])

useEffect(()=>{

fetch("http://localhost:5000/api/bills")
.then(res=>res.json())
.then(data=>setBills(data))

},[])

const verifyBill = async(id)=>{

 await fetch(`http://localhost:5000/api/bills/approve/${id}`,{
 method:"PUT"
 })

 alert("Bill approved")

}

  const fetchApprovedNGOs = async () => {
    const res = await fetch("http://localhost:5000/api/ngos/approved");
    setApprovedNgos(await res.json());
  };

  const fetchBlockedNGOs = async () => {
    const res = await fetch("http://localhost:5000/api/ngos/blocked");
    setBlockedNgos(await res.json());
  };

  const refreshAll = async () => {
    await Promise.all([
      fetchPendingNGOs(),
      fetchApprovedNGOs(),
      fetchBlockedNGOs(),
    ]);
  };

  useEffect(() => {
    refreshAll().finally(() => setLoading(false));
  }, []);

  /* ================= ACTIONS ================= */
  const approveNGO = async (id) => {
    if (!window.confirm("Approve this NGO?")) return;
    await fetch(`http://localhost:5000/api/ngos/approve/${id}`, { method: "PUT" });
    refreshAll();
  };

const rejectNGO = async (id) => {
  const reason = prompt("Enter rejection reason");
  if (!reason) return;

  await fetch(`http://localhost:5000/api/ngos/block/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  refreshAll();
};

  const blockNGO = async (id) => {
    const reason = prompt("Enter fraud / block reason");
    if (!reason) return;
    await fetch(`http://localhost:5000/api/ngos/block/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    refreshAll();
  };

  const unblockNGO = async (id) => {
    if (!window.confirm("Unblock & auto-approve this NGO?")) return;
    await fetch(`http://localhost:5000/api/ngos/unblock/${id}`, { method: "PUT" });
    refreshAll();
  };

  const totalNGOs =
    pendingNgos.length + approvedNgos.length + blockedNgos.length;

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* ================= SIDEBAR ================= */}
        <aside style={styles.sidebar}>
          <img src={adminImg} alt="Admin" style={styles.avatar} />
          <h3>Ankit Kumar</h3>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Platform Admin</p>

          <div style={styles.sideStats}>
            <div><b>{totalNGOs}</b><span> Total NGOs</span></div>
            <div><b>{pendingNgos.length}</b><span> Pending</span></div>
            <div><b>{approvedNgos.length}</b><span> Approved</span></div>
            <div><b>{blockedNgos.length}</b><span> Blocked</span></div>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main style={styles.main}>
          {/* ================= PENDING ================= */}
          <Section title="Pending NGO Requests">
            {loading && <p>Loading...</p>}
            {!loading && pendingNgos.length === 0 && (
              <Empty text="No pending NGO requests 🎉" />
            )}

            <CardGrid>
              {pendingNgos.map((ngo) => (
                <NGOCard
  key={ngo._id}
  ngo={ngo}
  status="PENDING"
  onClick={() => setSelectedNgo(ngo)}
>

                  <ActionRow>
                    <ActionBtn color="green" onClick={() => approveNGO(ngo._id)}>
                      Approve
                    </ActionBtn>
                    <ActionBtn color="red" onClick={() => rejectNGO(ngo._id)}>
                      Reject
                    </ActionBtn>
                  </ActionRow>
                </NGOCard>
              ))}
            </CardGrid>
          </Section>

          {/* ================= APPROVED ================= */}
          <Section title="Approved NGOs">
            {approvedNgos.length === 0 && (
              <Empty text="No approved NGOs yet" />
            )}

            <CardGrid>
              {approvedNgos.map((ngo) => (
                <NGOCard key={ngo._id} ngo={ngo} status="APPROVED">
                  <ActionBtn color="brown" onClick={() => blockNGO(ngo._id)}>
                    Block NGO
                  </ActionBtn>
                </NGOCard>
              ))}
            </CardGrid>
          </Section>

<h2>Bill Verification</h2>

{bills.map(bill=>(
<div key={bill._id}>

<img
 src={`http://localhost:5000/uploads/${bill.image}`}
 width="200"
/>

<p>Status: {bill.status}</p>

<button onClick={()=>verifyBill(bill._id)}>
Approve
</button>

</div>
))}
          {/* ================= BLOCKED ================= */}
          <Section title="Blocked NGOs">
            {blockedNgos.length === 0 && (
              <Empty text="No blocked NGOs 👍" />
            )}

            <CardGrid>
              {blockedNgos.map((ngo) => (
                <NGOCard key={ngo._id} ngo={ngo} status="BLOCKED">
                  <p style={styles.reason}>
                    <b>Block Reason:</b> {ngo.blockReason}
                  </p>

                  {ngo.reverifyRequested && (
                    <p style={styles.reason}>
                      <b>NGO Message:</b> {ngo.reverifyMessage}
                    </p>
                  )}

                  <ActionBtn color="green" onClick={() => unblockNGO(ngo._id)}>
                    Unblock & Auto-Approve
                  </ActionBtn>
                </NGOCard>
              ))}
            </CardGrid>
          </Section>
        </main>
      </div>
{/* ================= NGO DETAILS MODAL ================= */}
{selectedNgo && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <button
        style={styles.closeBtn}
        onClick={() => setSelectedNgo(null)}
      >
        ✕
      </button>

      <h2>{selectedNgo.name}</h2>
      <p style={styles.modalStatus}>
        Status: <b>{selectedNgo.status.toUpperCase()}</b>
      </p>

      <div style={styles.modalInfo}>
        <p><b>Registration No:</b> {selectedNgo.registrationNumber}</p>
        <p><b>Email:</b> {selectedNgo.email || "Not provided"}</p>
        <p><b>Type:</b> {selectedNgo.type}</p>
        <p><b>Address:</b> {selectedNgo.address}</p>
      </div>

      {selectedNgo.rejectionReason && (
        <div style={styles.rejectBox}>
          ❌ <b>Rejection Reason:</b> {selectedNgo.rejectionReason}
        </div>
      )}

      {selectedNgo.isBlocked && (
        <div style={styles.rejectBox}>
          🚫 <b>Block Reason:</b> {selectedNgo.blockReason}
        </div>
      )}

      {selectedNgo.reverifyRequested && (
        <div style={styles.pendingBox}>
          📩 <b>NGO Message:</b> {selectedNgo.reverifyMessage}
        </div>
      )}

      <a
        href={`http://localhost:5000/uploads/${selectedNgo.document}`}
        target="_blank"
        rel="noreferrer"
        style={styles.docBtn}
      >
        📄 View Uploaded Document
      </a>
    </div>
  </div>
)}

      <Footer />
    </>
  );
}

export default AdminDashboard;

/* ================= REUSABLE UI ================= */

const Section = ({ title, children }) => (
  <section style={{ marginBottom: "50px" }}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    {children}
  </section>
);

const CardGrid = ({ children }) => (
  <div style={styles.grid}>{children}</div>
);

const NGOCard = ({ ngo, status, onClick, children }) => (
  <div
    style={styles.card}
    onClick={onClick}   // ✅ correct
  >
    <h3>{ngo.name}</h3>
    <p><b>Type:</b> {ngo.type}</p>
    <p><b>Address:</b> {ngo.address}</p>

    <span style={styles.badge(status)}>{status}</span>

    <a
      href={`http://localhost:5000/uploads/${ngo.document}`}
      target="_blank"
      rel="noreferrer"
      style={styles.link}
      onClick={(e) => e.stopPropagation()} // 🔥 VERY IMPORTANT
    >
      View Document
    </a>

    {children}
  </div>
);


const ActionRow = ({ children }) => (
  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    {children}
  </div>
);

const ActionBtn = ({ children, color, ...props }) => (
  <button style={styles.btn(color)} {...props}>
    {children}
  </button>
);

const Empty = ({ text }) => (
  <p style={{ color: "#6b7280", fontStyle: "italic" }}>{text}</p>
);

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
  background: "linear-gradient(180deg, #ffffff, #f9fafb)",
  borderRadius: "20px",
  padding: "30px 20px",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  position: "sticky",
  top: "90px",
  height: "fit-content",
},


avatar: {
  width: "95px",
  height: "95px",
  borderRadius: "50%",
  marginBottom: "12px",
  border: "4px solid #22c55e",
  boxShadow: "0 0 0 6px rgba(34,197,94,0.15)",
},


 sideStats: {
  marginTop: "30px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
},

  main: { flex: 1 },

  sectionTitle: {
    fontSize: "22px",
    marginBottom: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },

card: {
  background: "white",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  cursor: "pointer",
  transition: "all 0.25s ease",
},


  link: {
    color: "#2563eb",
    fontSize: "14px",
    marginTop: "4px",
  },

badge: (status) => ({
  background:
    status === "APPROVED"
      ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
      : status === "BLOCKED"
      ? "linear-gradient(135deg, #fee2e2, #fecaca)"
      : "linear-gradient(135deg, #fef3c7, #fde68a)",
  color:
    status === "APPROVED"
      ? "#14532d"
      : status === "BLOCKED"
      ? "#7f1d1d"
      : "#78350f",
  padding: "6px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
  width: "fit-content",
}),


btn: (color) => ({
  padding: "10px 14px",
  background:
    color === "green"
      ? "linear-gradient(135deg, #22c55e, #16a34a)"
      : color === "red"
      ? "linear-gradient(135deg, #ef4444, #b91c1c)"
      : "linear-gradient(135deg, #92400e, #7c2d12)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "transform 0.2s",
}),


  reason: {
    fontSize: "13px",
    marginTop: "5px",
  },

  modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
},

modal: {
  width: "440px",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "28px",
  position: "relative",
  boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
},


closeBtn: {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
},

modalStatus: {
  marginTop: "6px",
  fontSize: "14px",
  color: "#374151",
},

modalInfo: {
  marginTop: "15px",
  fontSize: "14px",
  lineHeight: "1.7",
},

rejectBox: {
  marginTop: "12px",
  padding: "10px",
  background: "#fee2e2",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#991b1b",
},

pendingBox: {
  marginTop: "12px",
  padding: "10px",
  background: "#fef3c7",
  borderRadius: "8px",
  fontSize: "13px",
},

docBtn: {
  display: "inline-block",
  marginTop: "15px",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  borderRadius: "10px",
  textDecoration: "none",
  fontSize: "14px",
},
sideStatCard: {
  background: "#f9fafb",
  padding: "12px",
  borderRadius: "14px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
  fontSize: "13px",
},

};
