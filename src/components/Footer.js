import "./Footer.css";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import termsPdf from "../assets/Terms of Trade.pdf";

export default function Footer() {
  return (
    <div className="footer">
      <div className="logo">
        <img src={Logo} alt="KPC logo" />
      </div>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/team">Team</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
        <li>
          <a href={termsPdf} download="KPC_terms&conditions.pdf">
            Terms
          </a>
        </li>
      </ul>
      <div className="footer-copyright">
        2023 Kauri Point Construction, All Rights Reserved
      </div>
    </div>
  );
}
