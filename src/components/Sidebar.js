import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUserRole } from "../hooks/useUserRole";

//styles
import "./Sidebar.css";

export default function Sidebar() {
  const { user, authIsReady } = useAuthContext();
  const userRole = useUserRole(user);
  // console.log(userRole)

  return (
    <div className="sidebar">
      <nav className="links">
        <ul>
          {authIsReady && (
            <li>
              <NavLink exact to="/">
                Project List
              </NavLink>
            </li>
          )}
          {userRole === "admin" && (
            <>
              <li>
                <NavLink to="/create">Create Project</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Create New User</NavLink>
              </li>
              <li>
                <NavLink to="/library">Library</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
