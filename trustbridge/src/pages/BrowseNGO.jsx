function BrowseNGO() {
  const ngos = [
    { name: "Helping Hands", verified: true },
    { name: "Food For All", verified: true },
    { name: "Education First", verified: true },
  ];

  return (
    <div>
      <h2>Verified NGOs</h2>

      {ngos.map((ngo, index) => (
        <div key={index} style={styles.card}>
          <h3>{ngo.name}</h3>
          <p>✔ Verified</p>
          <button>View Details</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
  },
};

export default BrowseNGO;
