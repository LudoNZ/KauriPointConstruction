import { useParams } from "react-router-dom";
import { useState } from "react";
import { useFirestore } from "../../../hooks/useFirestore";
import Modal from "react-overlays/Modal";
import { FormInput } from "../../create/Create";

// styles
import "./ProjectUpdate.css";
import { timestamp } from "../../../firebase/config";

export default function ProjectUpdateProjectDetail({ project }) {
  const { updateDocument, response } = useFirestore("projects");
  const [formError, setFormError] = useState(null);
  const { id } = useParams();
  // const location = useLocation()

  // console.log(location.pathname)

  const [projectStatus, setStatus] = useState(project.projectStatus);
  const [startDate, setStartDate] = useState(
    project.startDate.toDate().toISOString().substring(0, 10)
  );
  const [subContractFee, setSubContractFee] = useState(project.subContractFee);
  const [description, setDescription] = useState(project.description);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberRate, setMemberRate] = useState("");
  const [teamList, setTeamList] = useState(project.team);

  // console.log(project.team)

  const [showModal, setShowModal] = useState(false);

  // Modal display functions
  const handleClose = () => setShowModal(false);
  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  // Modifing Staff Members functions
  const handleTeamAdd = () => {
    const member = { name: memberName, role: memberRole, rate: memberRate };
    setTeamList([...teamList, member]);
    setMemberName("");
    setMemberRole("");
    setMemberRate("");
  };
  const handleTeamRemove = (index) => {
    const list = [...teamList];
    list.splice(index, 1);
    setTeamList(list);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError(null);

    const updateProject = {
      projectStatus,
      subContractFee,
      description,
      team: teamList,
      startDate: timestamp.fromDate(new Date(startDate)),
    };

    await updateDocument(id, updateProject);
    setShowModal(false);
  };

  const handleRoleSelectInput = (value) => {
    setMemberRole(value);
  };

  return (
    <div className="project-client-info">
      <div>
        <button type="btn" id="btn_right" onClick={() => setShowModal(true)}>
          + Update Project Details
        </button>
      </div>

      <Modal
        className="modal"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="modal-header">
            <div className="modal-title">
              <h3>Update Project:</h3>
              <span>{project.name}</span>
            </div>
            <div>
              <span className="close-button" onClick={handleClose}>
                x
              </span>
            </div>
          </div>
          <div className="modal-desc">
            <form onSubmit={handleUpdate}>
              <FormInput
                label="Start date"
                onChange={setStartDate}
                value={startDate}
                type="date"
              />
              <FormInput
                label="Sub Contract Fee"
                onChange={setSubContractFee}
                value={subContractFee}
                type="number"
                step={0.01}
              />
              <FormInput
                label="Description"
                onChange={setDescription}
                value={description}
              />
              <FormInput
                label="Status"
                onChange={setStatus}
                value={projectStatus}
                options={["open", "close", "upcoming"]}
              />

              <div>
                <h3>Assign Staff Members</h3>
                {teamList && Array.isArray(teamList) ? (
                  <TeamMembers
                    teamList={teamList}
                    handleTeamRemove={handleTeamRemove}
                  />
                ) : (
                  <p>No team staff assigned</p>
                )}
              </div>

              <form>
                <label>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    placeholder="name"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />
                  <select
                    name="role"
                    type="text"
                    id="role"
                    placeholder="role"
                    required
                    value={memberRole}
                    onChange={(e) => {
                      handleRoleSelectInput(e.target.value);
                      console.log("target.value: ", e.target.value);
                    }}
                  >
                    <option>-</option>
                    <option>Foreman</option>
                    <option>Builder 1</option>
                    <option>Builder 2</option>
                    <option>Apprentice 1</option>
                    <option>Apprentice 2</option>
                  </select>

                  <input
                    name="rate"
                    type="text"
                    id="rate"
                    placeholder="rate"
                    required
                    value={memberRate}
                    onChange={(e) => setMemberRate(e.target.value)}
                  />
                  <button className="btn" onClick={handleTeamAdd}>
                    +
                  </button>
                </label>
              </form>

              <div className="modal-footer">
                <div>
                  <button className="btn-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>
                <div>
                  <button className="btn">Update Project</button>
                </div>
              </div>
              {formError && <p className="error">{formError}</p>}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const TeamMembers = ({ teamList, handleTeamRemove }) => {
  return (
    <table className="staffTable">
      <tr>
        <th>#</th>
        <th>name</th>
        <th>role</th>
        <th>rate</th>
        <th>delete</th>
      </tr>

      {teamList.map((singleStaff, index) => {
        const name = singleStaff.name ? singleStaff.name : "-no-name-";
        const role = singleStaff.role ? singleStaff.role : "-no-roll-";
        const rate = singleStaff.rate ? singleStaff.rate : "-no-rate-";

        return (
          <tr key={index} className="staffMember">
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{role}</td>
            <td>{rate}</td>
            <td>
              <button
                type="button"
                className="btn-red"
                onClick={() => handleTeamRemove(index)}
              >
                x
              </button>
            </td>
          </tr>
        );
      })}
    </table>
  );
};
