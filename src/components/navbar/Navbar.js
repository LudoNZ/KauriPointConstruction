import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import phone from "../../assets/icons/phone.png";

// styles & images
import "./Navbar.css";
import Logo from "../../assets/logo.png";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  // removed link for Security // <li><Link to="/signup">Signup</Link></li>
  return (
    <nav className="navbar">
      <ContactCard />

      {user && <div className="username">Hi {user.displayName}</div>}

      <div className="logo">
        <img src={Logo} alt="KPC logo" />
      </div>

      <>
        {!user && (
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        )}
        {user && (
          <>
            <ul>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/team">Team</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/">App</Link>
              </li>
              <li>
                {!isPending && (
                  <button className="btn" onClick={logout}>
                    Logout
                  </button>
                )}
                {isPending && (
                  <button className="btn" disabled>
                    Loging out...
                  </button>
                )}
              </li>
            </ul>
          </>
        )}
      </>
    </nav>
  );
}

const ContactCard = () => {
  return (
    <div className="quickContactCard">
      <div className="phone">
        <img src={phone} alt="phone call"></img>
        <div className="phone-text">021 037 2837</div>
      </div>
      <div className="email">simon@kauripointconstruction.co.nz</div>
    </div>
  );
};
