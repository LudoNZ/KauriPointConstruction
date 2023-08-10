import { useState } from "react";
import { ACTIONS } from "../ProjectUpdateMainList";
import Modal from "react-overlays/Modal";

export default function CreateNewStage({ stage, dispatch }) {
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState(null);

  // Adding a task in state (reStage)
  const [newStage, setNewStage] = useState("");

  const [code, setCode] = useState("");
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState("");
  const [comments, setComments] = useState("");
  const [subcontractor, setSubcontractor] = useState("");
  const [subcontractedamount, setSubcontractedamount] = useState("");
  const [calculatedamount, setCalculatedamount] = useState("");
  const [quoteEstimateOrProvision, setQuoteEstimateOrProvision] = useState("");

  // Modal display functions
  const handleClose = () => setShowModal(false);
  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  function handleSubmit(e) {
    e.preventDefault();
    // setFormError(null)
    const createNewStage = {
      name: newStage,
      tasks: [
        {
          code,
          task,
          status,
          details,
          comments,
          subcontractor,
          subcontractedamount,
          calculatedamount,
          quoteEstimateOrProvision,
        },
      ],
    };

    dispatch({
      type: ACTIONS.CREATE_STAGE,
      payload: { newStage: createNewStage },
    });

    handleClose();
  }

  return (
    <>
      <div>
        <button type="btn" onClick={() => setShowModal(true)}>
          + Create New Stage
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
              <h2>
                Create a New Stage:
                <br />
              </h2>
            </div>
            <div>
              <span className="close-button" onClick={handleClose}>
                x
              </span>
            </div>
          </div>
          <div className="modal-desc">
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  <h3>Stage</h3>
                  <span>Stage Name:</span>
                  <input
                    required
                    type="text"
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  <h3>Task</h3>
                  <span>Task Name:</span>
                  <input
                    required
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                  />
                </label>
                <FormInput label="Code" onChange={setCode} value={code} />
                <FormInput label="Status" onChange={setStatus} value={status} />
                <FormInput
                  label="Details"
                  onChange={setDetails}
                  value={details}
                />
                <FormInput
                  label="Comments"
                  onChange={setComments}
                  value={comments}
                />
                <FormInput
                  label="Subcontractor"
                  onChange={setSubcontractor}
                  value={subcontractor}
                />
                <FormInput
                  label="Subcontracted Amount"
                  onChange={setSubcontractedamount}
                  value={subcontractedamount}
                  type="number"
                />
                <FormInput
                  label="Calculated Amount"
                  onChange={setCalculatedamount}
                  value={calculatedamount}
                  type="number"
                />
                <FormInput
                  label="Quote Estimate Or Provision"
                  onChange={setQuoteEstimateOrProvision}
                  value={quoteEstimateOrProvision}
                />
              </div>

              <div className="modal-footer">
                <div>
                  <button className="btn-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>

                <div>
                  <button className="btn">Add Task</button>
                </div>
              </div>
              {formError && <p className="error">{formError}</p>}
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

function FormInput({ label, onChange, value, type }) {
  const handleInput = (value) => {
    onChange(value);
  };
  return (
    <label>
      <span>{label}</span>
      <input
        type={type ? type : "text"}
        onChange={(e) => handleInput(e.target.value)}
        value={value}
      ></input>
    </label>
  );
}
