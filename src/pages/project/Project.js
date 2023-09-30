import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUserRole } from "../../hooks/useUserRole";

import Sidebar from "../../components/Sidebar";
import ProjectClientInfo from "./ProjectClientInfo";
import ProjectDetail from "./ProjectDetail";
import ProjectLabourList from "./ProjectLabourList";
import ProjectUpdateClientInfo from "./projectUpdate/ProjectUpdateClientInfo";
import ProjectUpdateProjectDetail from "./projectUpdate/ProjectUpdateProjectDetail";
import ProjectFinancialInfo from "./ProjectFinancialInfo";

// styles
import "./Project.css";
import ClaimsList from "../../components/Claims/ClaimsList";
import ProjectUpdateMainList from "./projectUpdate/ProjectUpdateMainList";

//components
import InitialEstimate from "./projectUpdate/components/clientPDF/initialEstimate";

export default function Project() {
  const { id } = useParams();
  const { error, document } = useDocument("projects", id);
  const { user, authIsReady } = useAuthContext();
  const [switchList, SetSwitchList] = useState("Main");
  const [switchUpdateLabourList, setSwitchUpdateLabourList] = useState(false);
  const [switchUpdateMainList, setSwitchUpdateMainList] = useState(false);

  const userRole = useUserRole(user);
  // console.log(userRole)

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }

  // Switches for Main and Labour components
  const handleSwitchList = (listName) => {
    SetSwitchList(listName);
  };

  const reSwitchUpdateLabourList = () => {
    setSwitchUpdateLabourList(!switchUpdateLabourList);
  };
  const handleSwitchUpdateMainlist = () => {
    setSwitchUpdateMainList(!switchUpdateMainList);
  };

  const ViewSelector = ({ text }) => {
    return (
      <button
        onClick={() => handleSwitchList(text)}
        className="btn"
        id={switchList === text ? "btn-active" : "btn-disabled"}
      >
        {text}
      </button>
    );
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-container">
        <div className="project">
          <ProjectClientInfo project={document} />
          {userRole === "admin" && (
            <ProjectUpdateClientInfo project={document} />
          )}

          {/* Financial details */}
          {userRole === "admin" && <ProjectFinancialInfo project={document} />}

          <div
            className={
              !switchUpdateMainList
                ? !switchUpdateLabourList
                  ? "tabs"
                  : "tabs shrink"
                : "tabs shrink"
            }
          >
            <div className="listSelector">
              <ViewSelector text="Main" />
              <ViewSelector text="Labour" />

              {userRole === "admin" && (
                <>
                  <ViewSelector text="Claims" />
                  <ViewSelector text="Quotes" />
                </>
              )}
            </div>
            {switchUpdateLabourList && (
              <span className="updating-alert">
                !! SAVE LabourList CHANGES RECOMMENDED !!
              </span>
            )}
            {switchUpdateMainList && (
              <span className="updating-alert">
                !! SAVE Main List CHANGES RECOMMENDED !!
              </span>
            )}
          </div>

          {switchList === "Main" && (
            <>
              <ProjectUpdateMainList
                project={document}
                SetSwitchUpdateMainlist={handleSwitchUpdateMainlist}
                switchUpdateMainlist={switchUpdateMainList}
              />
              {userRole === "admin" && (
                <>
                  <ProjectDetail project={document} />
                  <ProjectUpdateProjectDetail project={document} />
                </>
              )}
            </>
          )}
          {switchList === "Labour" && (
            <ProjectLabourList
              project={document}
              setSwitchUpdateLabourList={reSwitchUpdateLabourList}
              switchUpdateLabourList={switchUpdateLabourList}
            />
          )}

          {switchList === "Claims" && <ClaimsList project={document} />}
          {switchList === "Quotes" && (
            <>
              <InitialEstimate project={document} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
