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
  const [selectedTask, setSelectedTask] = useState([])
  const [options, setOptions] = useState([])
  const [stageName, setStageName] = useState('')
  const [task, setTask] = useState([])

  // const [code, setCode] = useState('')
  // const [taskName, setTaskName] = useState('')
  //const [comments, setComments] = useState('')
  //const [status, setStatus] = useState('')
  const [details, setDetails] =useState('')
  const [subcontractor, setSubcontractor] = useState('')
  const [subcontractedamount, setSubcontractedamount] = useState('')
  const [calculatedamount, setCalculatedamount] = useState('')
  const [quoteEstimateOrProvision, setQuoteEstimateOrProvision] = useState('')

  // Modal display functions
  const handleClose = () => {
    setSelectedTask([])
    setShowModal(false)
  }
  const renderBackdrop = (props) => <div className="backdrop" {...props} />


  // Store the tasks currently in the state 
  //console.log('taskListCurrentlySelected', taskListCurrentlySelected)
  const taskListCurrentlySelected = Object.entries(stage.tasks).map((stageTask)=> {
    return stageTask.task
  })


  useEffect(() => {
    if(selectedTask){
      const passTask = selectedTask.value
      const passStage = selectedTask.stageName
      setTask(passTask)
      setStageName(passStage)
    }
    // console.log('taskList',taskList);
    // console.log('stageName',stageName);
  }, [selectedTask])


  function createTaskOption() {
      const allTasks = Object.values(document.stages).map(libStages => {
          return { stageName: libStages.name, value: libStages.tasks }       
      })
      let stageTasks = allTasks.filter(singleStage => singleStage.stageName === stage.name)

      let selectedTasks
      Object.entries(stageTasks).map(([key, stage]) => (
        selectedTasks = Object.entries(stage.value).map(([id, taskInfo]) => {
          // console.log('stageName', stage.stageName)
          return { value: {...taskInfo}, label: taskInfo.task, stageName: stage.stageName}
        })
      ))
      const fileteredTasks = selectedTasks.filter(function(selectTask) {
        return !taskListCurrentlySelected.includes(selectTask.label)
      })
      setOptions(fileteredTasks)
      setShowModal(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // setFormError(null)

    const newTask = task
    
    newTask.calculatedamount = calculatedamount
    newTask.details = details
    newTask.calculatedamount = calculatedamount
    newTask.subcontractedamount = subcontractedamount
    newTask.subcontractor = subcontractor
    newTask.quoteEstimateOrProvision = quoteEstimateOrProvision ? quoteEstimateOrProvision : "NULL"
    newTask.status = 'open'
    dispatch({ type: ACTIONS.ADD_TASK, payload: { stageName: stageName, task: newTask} })
    
    
    console.log('quoteEstimateOrProvision: ', quoteEstimateOrProvision)
    handleClose()
  }

  function handleSelectedTask(task) {
    console.log('task: ', task)
    setSelectedTask(task)
    setDetails(task.value.details)
    setCalculatedamount(task.value.calculatedamount)
    setSubcontractedamount(task.value.subcontractedamount)
    setSubcontractor(task.value.subcontractor)
    setQuoteEstimateOrProvision(task.value.quoteEstimateOrProvision)
    
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
            {formError && <p className="error">{formError}</p>}
          </form>

          </div>
        </div>
      </Modal>

    </>
  )
}

