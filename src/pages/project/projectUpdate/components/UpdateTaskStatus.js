import { useState } from "react";
import { ACTIONS } from "../ProjectUpdateMainList";
import Modal from "react-overlays/Modal";
// import { useFirestore } from '../../../../hooks/useFirestore'
// import { useParams, useHistory } from 'react-router-dom'

// styles
import "../ProjectUpdate.css";
import { FormInput } from "../../../create/Create";
import { numberWithCommas } from "../../ProjectFinancialInfo";

// export default function UpdateTaskStatus({stageKey, index, task, dispatch}) {
export default function UpdateTaskStatus({
  stageName,
  index,
  task,
  dispatch,
  fee,
}) {
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState(null);

  // const { updateTaskInDocument, response } = useFirestore('projects')
  // const { id } = useParams()
  const [label, setLabel] = useState(task.label ? task.label : task.task);
  const [details, setDetails] = useState(task.details);
  const [subcontractor, setSubcontractor] = useState(task.subcontractor);
  const [subcontractedamount, setSubcontractedamount] = useState(
    task.subcontractedamount
  );
  const [customPercentage, setCustomPercentage] = useState(
    task.customPercentage ? task.customPercentage : 0.0
  );
  const [calculatedamount, setCalculatedamount] = useState(
    task.customPercentage
      ? task.customPercentage * task.subcontractedamount
      : (1 + fee) * task.subcontractedamount
  );
  const [status, setStatus] = useState(task.status ? task.status : "Open");
  const [quoteEstimateOrProvision, setQuoteEstimateOrProvision] = useState(
    task.quoteEstimateOrProvision ? task.quoteEstimateOrProvision : ""
  );

  // console.log('key',key)

  // Modal display functions
  const handleClose = () => setShowModal(false);
  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    handleClose();

    const updatedTask = {
      ...task,
      label: label,
      details: details,
      subcontractor: subcontractor,
      subcontractedamount: subcontractedamount,
      customPercentage: customPercentage,
      calculatedamount: calculatedamount,
      status: status,
      quoteEstimateOrProvision: quoteEstimateOrProvision,
    };
    if (parseFloat(customPercentage) === 0) {
      delete updatedTask.customPercentage;
    }

    dispatch({
      type: ACTIONS.CHANGE_STATUS,
      payload: { stageName: stageName, index: index, task: updatedTask },
    });
    //console.log('task', task);
    // updateTaskInDocument(id, stageKey, index, tempCulatedamount, tempStatus)
    // dispatch({ type: ACTIONS.CHANGE_STATUS, payload:{ task: task.task }})
  }
  function handleSubcontractedamount(value) {
    setSubcontractedamount(value);
    setCalculatedamount(
      customPercentage > 0 ? customPercentage * value : (1 + fee) * value
    );
  }

  function handleCustomPercentage(value) {
    setCustomPercentage(value);
    value > 0
      ? setCalculatedamount(subcontractedamount * value)
      : setCalculatedamount(subcontractedamount * (1 + fee));
  }

  function handleDelete(e) {
    e.preventDefault();
    handleClose();
    const label = task.label ? task.label : task.task;
    dispatch({
      type: ACTIONS.DELETE_TASK_ITEM,
      payload: { stageName: stageName, label: label },
    });
  }

  return (
    <>
      <div>
        <button className="btn" type="btn" onClick={() => setShowModal(true)}>
          Modify
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
                Update Task:
                <br />
                {label}
              </h2>
              {task.label && <span>({task.task})</span>}
            </div>
            <div>
              <span className="close-button" onClick={handleClose}>
                x
              </span>
            </div>
          </div>
          <div className="modal-desc">
            <form>
              <div>
                <FormInput label="Label" value={label} onChange={setLabel} />
                <FormInput
                  label="Details"
                  value={details}
                  onChange={setDetails}
                />
                <FormInput
                  label="Subcontractor"
                  value={subcontractor}
                  onChange={setSubcontractor}
                />
                <FormInput
                  label="Subcontracted Amount"
                  value={subcontractedamount}
                  onChange={handleSubcontractedamount}
                />
                <div className="calculatedAmount">
                  <span>calculated:</span>
                  <span>${numberWithCommas(calculatedamount)}</span>
                </div>
                <FormInput
                  label="custom Fee % multiplier"
                  value={customPercentage}
                  onChange={handleCustomPercentage}
                />
                <FormInput
                  label="Status"
                  value={status}
                  options={["open", "closed"]}
                  onChange={(option) => setStatus(option)}
                />
                <FormInput
                  label="quoteEstimateOrProvision"
                  value={quoteEstimateOrProvision}
                  options={["estimate", "quote", "provision"]}
                  onChange={(option) => setQuoteEstimateOrProvision(option)}
                />
              </div>

              <div className="modal-footer">
                <div>
                  <button className="btn-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>
                <div>
                  <button className="btn-red" type="btn" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
                <div>
                  <button className="btn" onClick={handleSubmit}>
                    Update Task Details
                  </button>
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
