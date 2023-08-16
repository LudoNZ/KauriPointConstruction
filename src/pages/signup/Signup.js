import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import Select from "react-select";

// styles
import "./Signup.css";
import Sidebar from "../../components/Sidebar";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("");
  const { signup, isPending, error } = useSignup();

  const userRoleList = [
    { value: "admin", label: "admin" },
    { value: "foreman", label: "foreman" },
    { value: "staff", label: "staff" },
    { value: "client", label: "client" },
  ];
  const role = userRole.value;
  console.log("role", role);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, role);
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Create User Account</h2>
          <label>
            <span>email:</span>
            <input
              required
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label>
            <span>password:</span>
            <input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          <label>
            <span>display name:</span>
            <input
              required
              type="text"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
            />
          </label>
          <label>
            <span>User Role:</span>
            <Select
              required
              onChange={(option) => setUserRole(option)}
              options={userRoleList}
            />
          </label>
          {!isPending && <button className="btn">Sign up</button>}
          {isPending && (
            <button className="btn" disabled>
              loading
            </button>
          )}
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
