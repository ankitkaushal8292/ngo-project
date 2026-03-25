import { useState } from "react";

function DonationForm({ ngoId }) {
  const [frequency, setFrequency] = useState("monthly");
  const [amount, setAmount] = useState(1200);
  const [customAmount, setCustomAmount] = useState("");

  const handleDonate = async () => {

const donateAmount = customAmount || amount

if(!donateAmount){
alert("Please select amount")
return
}

try{

const res = await fetch("http://localhost:5000/api/donations/donate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
amount:donateAmount,
ngoId:ngoId
})
})

const data = await res.json()

if(!res.ok){
alert(data.message || "Donation failed")
return
}

alert("Donation successful 🎉")

setAmount(1200)
setCustomAmount("")

}catch(err){
alert("Server error")
}

}

  const presetAmounts = [800, 1200, 1600, 2400];

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: "20px" }}>I pledge to</h2>

      {/* Frequency Buttons */}
      <div style={styles.toggleRow}>
        <button
          onClick={() => setFrequency("one-time")}
          style={{
            ...styles.toggleBtn,
            background:
              frequency === "one-time" ? "#ef4444" : "white",
            color: frequency === "one-time" ? "white" : "black",
          }}
        >
          GIVE ONE-TIME
        </button>

        <button
          onClick={() => setFrequency("monthly")}
          style={{
            ...styles.toggleBtn,
            background:
              frequency === "monthly" ? "#ef4444" : "white",
            color: frequency === "monthly" ? "white" : "black",
          }}
        >
          GIVE MONTHLY
        </button>
      </div>

      <h3 style={{ marginTop: "25px" }}>A sum of INR</h3>

      {/* Amount Grid */}
      <div style={styles.grid}>
        {presetAmounts.map((val) => (
          <button
            key={val}
            onClick={() => {
              setAmount(val);
              setCustomAmount("");
            }}
            style={{
              ...styles.amountBtn,
              border:
                amount === val && !customAmount
                  ? "2px solid #ef4444"
                  : "1px solid #ef4444",
            }}
          >
            ₹ {val}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <input
        type="number"
        placeholder="Other Amount"
        value={customAmount}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setAmount("");
        }}
        style={styles.input}
      />

      {/* Payment Type */}
      <div style={{ marginTop: "20px" }}>
        <h4>Payment Type:</h4>
        <label>
          <input type="radio" defaultChecked /> NETBANKING
        </label>
      </div>

      {/* Donate Button */}
     <button
onClick={handleDonate}
style={styles.donateBtn}
>
DONATE NOW
</button>
    </div>
  );
}

export default DonationForm;

/* ================= STYLES ================= */

const styles = {
  container: {
    background: "#f5efe6",
    padding: "30px",
    borderRadius: "16px",
    maxWidth: "450px",
  },

  toggleRow: {
    display: "flex",
    gap: "10px",
  },

  toggleBtn: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ef4444",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "15px",
  },

  amountBtn: {
    padding: "12px",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
  },

  input: {
    marginTop: "15px",
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
  },

  donateBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "14px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};