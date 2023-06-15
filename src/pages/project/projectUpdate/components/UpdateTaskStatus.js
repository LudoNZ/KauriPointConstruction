import { useState } from 'react'
import { ACTIONS } from '../ProjectUpdateMainList'
import Modal from "react-overlays/Modal"
// import { useFirestore } from '../../../../hooks/useFirestore'
// import { useParams, useHistory } from 'react-router-dom'


// styles
import '../ProjectUpdate.css'
import { FormInput } from '../../../create/Create'

// export default function UpdateTaskStatus({stageKey, index, task, dispatch}) {
export default function UpdateTaskStatus({stageName, index, task, dispatch}) {
  const [showModal, setShowModal] = useState(false)
  const [formError, setFormError] = useState(null)

  // const { updateTaskInDocument, response } = useFirestore('projects')
  // const { id } = useParams()
  const [details, setDetails] = useState(task.details)
  const [subcontractor, setSubcontractor] = useState(task.subcontractor)
  const [subcontractedamount, setSubcontractedamount] = useState(task.subcontractedamount)
  const [calculatedamount, setCalculatedamount] = useState(task.calculatedamount)
  const [status, setStatus] = useState(task.status? task.status : "Open" )
  const [quoteEstimateOrProvision, setQuoteEstimateOrProvision] = useState(task.quoteEstimateOrProvision)
  
  // console.log('key',key)

  // Modal display functions
  const handleClose = () => setShowModal(false)
  const renderBackdrop = (props) => <div className="backdrop" {...props} />

  function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    handleClose()

    // const taskDetails = [
    //   { subcontractor: subcontractor },
    //   { details: details},
    //   { subcontractedamount: subcontractedamount},
    //   { calculatedamount: calculatedamount},
    //   { status: status},
    //   { quoteEstimateOrProvision: quoteEstimateOrProvision},
    // ]
   
    // task.subcontractor = subcontractor
    // task.details = details
    // task.subcontractedamount = subcontractedamount
    // task.calculatedamount = calculatedamount
    // task.status = status
    // task.quoteEstimateOrProvision = quoteEstimateOrProvision

    dispatch({ 
      type: ACTIONS.CHANGE_STATUS, 
      payload:{ stageName:stageName,
                index:index,
                task: task,
                subcontractor: subcontractor,
                details: details,
                subcontractedamount: subcontractedamount,
                calculatedamount: calculatedamount,
                status: status,
                quoteEstimateOrProvision: quoteEstimateOrProvision,
              }
    })
    //console.log('task', task);
    // updateTaskInDocument(id, stageKey, index, tempCulatedamount, tempStatus)
    // dispatch({ type: ACTIONS.CHANGE_STATUS, payload:{ task: task.task }})
  }

  function handleDelete(e) {
    e.preventDefault()
    handleClose()
    dispatch({ type: ACTIONS.DELETE_TASK_ITEM, payload:{ task: task.task }})  
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
                  Update Task:<br /> 
                  {task.task}
                </h2>
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
              <FormInput label='Details' 
                          value={details} 
                          onChange={setDetails} />
              <FormInput label='Subcontractor' 
                          value={subcontractor} 
                          onChange={setSubcontractor} />
              <FormInput label='Subcontracted Amount' 
                          value={subcontractedamount} 
                          onChange={setSubcontractedamount} />
              <FormInput label='Charge Amount' 
                          value={calculatedamount} 
                          onChange={setCalculatedamount} />
              <FormInput label='Status' 
                          value={status} 
                          options={['open', 'closed']}
                          onChange={ option => setStatus(option)} />
              <FormInput label='quoteEstimateOrProvision' 
                          value={quoteEstimateOrProvision} 
                          options={[ 'estimate', 'quote', 'provision']}
                          onChange={ option => setQuoteEstimateOrProvision(option) } />
              
              
            </div>
            
              <div className="modal-footer">
                <div>
                  <button className="btn-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>
                <div>
                  <button 
                    className="btn" 
                    type="btn"
                    onClick= {handleDelete}
                  >
                    Delete
                  </button>
                </div>
                <div>
                  <button 
                    className="btn" 
                    onClick={handleSubmit}>
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
  )
}
