import "./ProjectClientInfo.css";

export default function ProjectClientInfo({ project }) {
  const name = project.name;
  const clientName = project.clientName;
  const phone = project.phone ? project.phone : "-";
  const email = project.email ? project.email : "-";

  const line1 = project.address.line1 ? project.address.line1 : "-";
  const suburb = project.address.suburb ? project.address.suburb : "-";
  const city = project.address.city ? project.address.city : "-";
  const address = line1 + ", " + suburb + ", " + city;

  return (
    <div className="project-client-info">
      <h2 className="page-title">
        Project: <strong>{name}</strong>
      </h2>
      <div>
        <ClientInfo label="Client" value={clientName} />
        <ClientInfo label="Phone" value={phone} />
        <ClientInfo label="Email" value={email} />
        <ClientInfo label="Address" value={address} />
      </div>
    </div>
  );
}

const ClientInfo = ({ label, value }) => {
  return (
    <div>
      <span className="clientInfoLabel">{label}: </span>
      <span className="clientInfoValue">{value}</span>
    </div>
  );
};
