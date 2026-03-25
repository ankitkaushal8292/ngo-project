import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onClose }) {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select role");
      return;
    }

    if (!identifier || !password) {
      alert("Please enter email/registration number and password");
      return;
    }

    /* ================= ADMIN LOGIN ================= */

    if (role === "admin") {
      if (
        identifier === "admin@trustbridge.com" &&
        password === "admin123"
      ) {
        sessionStorage.clear();

        sessionStorage.setItem("role", "admin");

        navigate("/admin-dashboard");
        onClose && onClose();
      } else {
        alert("Invalid admin credentials");
      }

      return;
    }

    /* ================= DONOR LOGIN ================= */

    if (role === "donor") {

      sessionStorage.removeItem("ngo");
      sessionStorage.removeItem("ngoId");

      sessionStorage.setItem(
        "donor",
        JSON.stringify({
          name: identifier.split("@")[0],
          email: identifier,
          joinedAt: new Date().toISOString(),
        })
      );

      sessionStorage.setItem("role", "donor");

      navigate("/");
      onClose && onClose();
      return;
    }

    /* ================= NGO LOGIN ================= */

    if (role === "ngo") {
      try {
        const res = await fetch(
          "http://localhost:5000/api/ngos/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              registrationNumber: identifier,
              password,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "NGO login failed");
          return;
        }

        sessionStorage.clear();

        sessionStorage.setItem("role", "ngo");
        sessionStorage.setItem("ngoId", data.ngo._id);
        sessionStorage.setItem("ngo", JSON.stringify(data.ngo));
        sessionStorage.setItem("ngoStatus", data.ngo.status);

        navigate(`/ngo-dashboard/${data.ngo._id}`);

        onClose && onClose();

      } catch (err) {
        console.error(err);
        alert("Server error during NGO login");
      }
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <button onClick={onClose} style={styles.close}>×</button>

        <h2>Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>

          {/* EMAIL OR REGISTRATION NUMBER */}

          <input
            type={role === "ngo" ? "text" : "email"}
            placeholder={
              role === "ngo"
                ? "NGO Registration Number"
                : "Email"
            }
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={styles.input}
            required
          />

          {/* PASSWORD FOR ALL ROLES */}

          {role && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          )}

          {/* ROLE SELECT */}

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setIdentifier("");
              setPassword("");
            }}
            style={styles.input}
            required
          >
            <option value="">Select Role</option>
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" style={styles.loginBtn}>
            Login
          </button>

        </form>

        <button
          style={styles.signupBtn}
          onClick={() => navigate("/signup")}
        >
          Create New Account
        </button>

      </div>
    </div>
  );
}

export default Login;


/* ================= STYLES ================= */

const styles = {

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "14px",
    position: "relative",
    textAlign: "center",
  },

  close: {
    position: "absolute",
    top: "10px",
    right: "14px",
    fontSize: "22px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },

  loginBtn: {
    padding: "12px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "6px",
  },

  signupBtn: {
    marginTop: "12px",
    padding: "10px",
    backgroundColor: "white",
    color: "#22c55e",
    border: "1px solid #22c55e",
    borderRadius: "10px",
    cursor: "pointer",
  },

};