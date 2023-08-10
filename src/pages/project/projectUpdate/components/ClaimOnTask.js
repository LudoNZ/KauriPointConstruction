import { useState } from "react";
import { ACTIONS } from "../ProjectUpdateMainList";
import Modal from "react-overlays/Modal";

//styles
import "./ClaimOnTask.css";
import { FormInput } from "../../../create/Create";

export default function ClaimOnTask({ stageName, index, task, dispatch }) {
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState(null);

  const [nextClaim, setNextClaim] = useState(
    task.nextClaim ? task.nextClaim : 0
  );

  //Modal display Functions
  const handleClose = () => setShowModal(false);
  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  //SUBMIT
  function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    handleClose();

    let item = {
      type: ACTIONS.MAKE_CLAIM,
      payload: { nextClaim: nextClaim },
      stageName: stageName,
      index: index,
      task: task,
    };

    console.log("package: ", item);
    dispatch(item);
  }

  return (
    <>
      <button className="btn" onClick={() => setShowModal(true)}>
        +
      </button>

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
                Task Claims:
                <strong> {task.task ? task.task : "TASKNAME"}</strong>
              </h2>
            </div>
            <div>
              <span className="close-button" onClick={handleClose}>
                x
              </span>
            </div>
          </div>

          <div className="modal-desc">
            <h3>claims history:</h3>

            {task.claims &&
              (Object.entries(task.claims).length === 0 ? (
                <p>No Claims yet</p>
              ) : (
                Object.entries(task.claims).map(([key, c]) => {
                  return (
                    <div key={key}>
                      <p>
                        {key}: {c}
                      </p>
                    </div>
                  );
                })
              ))}

            <form>
              <div>
                <FormInput
                  label="next claim:"
                  value={nextClaim}
                  type="number"
                  onChange={setNextClaim}
                />
              </div>

              <div className="modal-footer">
                <div>
                  <button className="btn-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>
                <div></div>
                <div>
                  <button className="btn" onClick={handleSubmit}>
                    save Claim
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
