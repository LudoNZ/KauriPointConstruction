import { useState, useEffect } from 'react'
import { useDocument } from '../../../../hooks/useDocument'
import { ACTIONS } from '../ProjectUpdateMainList'
import Modal from "react-overlays/Modal"
import Select from 'react-select'
import './AddTask.css'
import { FormInput } from '../../../create/Create'

export default function AddTask({stage, dispatch}) {
  //Modal
  const [showModal, setShowModal] = useState(false)
  const [formError, setFormError] = useState(null)

  // Firebase
  const mainList_id = 'mainList'
  const { error, document } = useDocument('taskLibrary' , mainList_id)

  // Adding a task in state (reStage)
  const [selectedTask, setSelectedTask] = useState({})
  const [options, setOptions] = useState([])

  // const [code, setCode] = useState('')
  // const [taskName, setTaskName] = useState('')
  //const [comments, setComments] = useState('')
  //const [status, setStatus] = useState('')
  const [details, setDetails] =useState('')
  const [subcontractor, setSubcontractor] = useState('')
  const [subcontractedamount, setSubcontractedamount] = useState('')
  const [calculatedamount, setCalculatedamount] = useState('')
  const [quoteEstimateOrProvision, setQuoteEstimateOrProvision] = useState('')
  const [label, setLabel] =useState('')

  // Modal display functions
  const handleClose = () => {
    setSelectedTask({})
    setShowModal(false)
  }
  const renderBackdrop = (props) => <div className="backdrop" {...props} />


  // Store the tasks currently in the state 
  //console.log('taskListCurrentlySelected', taskListCurrentlySelected)
  const taskListCurrentlySelected = Object.entries(stage.tasks).map((stageTask)=> {
    return stageTask.task
  })

  function checkLabelIsUnique(label) {
    setFormError(null)
    stage.tasks.forEach(task => { if(task.label === label) {
      const errorMessage = 'WARNING!: ' + task.label + 'is not unique!'
      setFormError(errorMessage)}} )
    setLabel(label)
  }


  function createTaskOption() {
      const allTasks = document.stages
      console.log('all Tasks:', allTasks)
      
      let stageTasks = (allTasks.filter(singleStage => {
        return singleStage.name === stage.name
      }))[0].tasks
      console.log('stageTasks:' , stageTasks)
      
      let selectedTasks = stageTasks.map( task => {
          // console.log('stageName', stage.name)
          return { ...task, label: task.task, stageName: stage.name}
        })
      
      const fileteredTasks = selectedTasks.filter(function(selectTask) {
        return !taskListCurrentlySelected.includes(selectTask.label)
      })
      setOptions(fileteredTasks)
      setShowModal(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // setFormError(null)

    const newTask = {
      ...selectedTask,
      calculatedamount: calculatedamount,
      label: label,
      details: details,
      calculatedamount: calculatedamount,
      subcontractedamount: subcontractedamount,
      subcontractor: subcontractor,
      quoteEstimateOrProvision: quoteEstimateOrProvision ? quoteEstimateOrProvision : "NULL",
      status: 'open'
    }
    
    
    dispatch({ type: ACTIONS.ADD_TASK, payload: { stageName: stage.name, task: newTask} })
    
    
    console.log('quoteEstimateOrProvision: ', quoteEstimateOrProvision)
    handleClose()
  }

  function handleSelectedTask(task) {
    console.log('task: ', task)
    setSelectedTask(task)
    setDetails(task.details)
    setCalculatedamount(task.calculatedamount)
    setSubcontractedamount(task.subcontractedamount)
    setSubcontractor(task.subcontractor)
    setQuoteEstimateOrProvision(task.quoteEstimateOrProvision)
    checkLabelIsUnique(task.label)
  }

  return (
    <>
      <button type="btn" onClick={createTaskOption}>
          + Add Task
        </button>
      
      <Modal
        className="modal"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
        >
        <div>
          <div className="modal-header">
            <h2 className="modal-title">Add Task:</h2>
            <span className="close-button" onClick={handleClose}>
              x
            </span>
          </div>

          <div className="modal-desc">


          <form>
              <h3>Stage: {stage.name}</h3>
              <label>
              <h3>Task:</h3>
              <Select
                className='inputSelector'
                onChange={(option) => handleSelectedTask(option)}
                options={options}
              />
              {/* <button className="btn" onClick={handleSet}>Set Option</button> */}
              </label>
            <br />
            <div>
            
            {formError && <p className="error">{formError}</p>}
            <FormInput label='Label:' 
                        value={label} 
                        onChange={checkLabelIsUnique}/>
            <FormInput label='Details' 
                        value={details} 
                        onChange={setDetails}/>
            <FormInput label='Charge amount' 
                        value={calculatedamount} 
                        onChange={setCalculatedamount}/>
            <FormInput label='SubContracted amount' 
                        value={subcontractedamount} 
                        onChange={setSubcontractedamount}/>
            <FormInput label='SubContractor' 
                        value={subcontractor} 
                        onChange={setSubcontractor}/>
            <FormInput label='Quote Estimate or Provision' 
                        value={quoteEstimateOrProvision} 
                        onChange={ option => setQuoteEstimateOrProvision(option) }
                        options={[ 'estimate', 'quote', 'provision']}/>
            </div>

              <div className="modal-footer">
                  <button className="btn-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                  <button className="btn" onClick={handleSubmit}>
                    Add Task
                  </button>
              </div>
          </form>

          </div>
        </div>
      </Modal>

    </>
  )
}

