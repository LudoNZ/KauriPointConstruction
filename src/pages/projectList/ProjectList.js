import { useState, useEffect } from "react";
import ProjectSummary from "./ProjectSummary";
import Sidebar from "../../components/Sidebar";
import { useCollection } from "../../hooks/useCollection";

// styles
import "./ProjectList.css";

export default function ProjectList() {
  const { documents, error } = useCollection("projects");
  const [projectOpen, setPojectOpen] = useState([]);
  const [projectUpcoming, setPojectUpcomung] = useState([]);
  const [projectClose, setPojectClose] = useState([]);

  useEffect(() => {
    if (documents) {
      const open = documents.filter(
        (project) => project.projectStatus === "open"
      );
      setPojectOpen(open);
      const upcoming = documents.filter(
        (project) => project.projectStatus === "upcoming"
      );
      setPojectUpcomung(upcoming);
      const close = documents.filter(
        (project) => project.projectStatus === "close"
      );
      setPojectClose(close);
      // console.log(projectOpen)
    }
  }, [documents]);

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-container">
        <div className="project-list">
          <h2 className="page-title">Project List</h2>
          {error && <p className="error">{error}</p>}
          <h2>In Progress</h2>
          {projectOpen && <ProjectSummary projects={projectOpen} />}
          <h2>Upcoming</h2>
          {projectUpcoming && <ProjectSummary projects={projectUpcoming} />}
          <h2>Closed</h2>
          {projectClose && <ProjectSummary projects={projectClose} />}
        </div>
      </div>
    </div>
  );
}
