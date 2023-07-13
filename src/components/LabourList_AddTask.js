import { useState, useEffect } from 'react'
import { useDocument } from '../hooks/useDocument'
import Modal from "react-overlays/Modal"
import Select from 'react-select'
import { FormInput } from '../pages/create/Create'

export default function AddLabourTask ({stage, dispatch}) {
    const [showModal, setShowModal] = useState(false)
    //const [formError, setFormError] = useState(null)

      // Firebase
  const { error, document } = useDocument('taskLibrary' , "labourList")

  // Adding a task in state (reStage)
  const [selectedTask, setSelectedTask] = useState([])
  const [options, setOptions] = useState([])
  const [stageName, setStageName] = useState('')
  const [task, setTask] = useState([])

  const [taskName, setTaskName] =useState('')

  // Modal display functions
  const handleClose = () => {
    setSelectedTask([])
    setShowModal(false)
  }
  const renderBackdrop = (props) => <div className="backdrop" {...props} />

  // Store the tasks currently in the state 
  //console.log('taskListCurrentlySelected', taskListCurrentlySelected)
  const taskListCurrentlySelected = Object.entries(stage.tasks).map((stageTask)=> {
    return stageTask.name
  })


  useEffect(() => {
    if(selectedTask){
      const passTask = selectedTask
      const passStage = selectedTask.stageName
      setTask(passTask)
      setStageName(passStage)
    }
    // console.log('taskList',taskList);
    // console.log('stageName',stageName);
  }, [selectedTask])


  function createTaskOption() {
      const allTasks = Object.values(document.stages).map(libStages => {
          return { stageName: libStages.name, tasks: libStages.tasks }       
      })
      console.log('ALL_TASKS: ', allTasks)
      console.log('STAGE: ', stage)

      let stageTasks = allTasks.filter(singleStage => {
        const assess = singleStage.stageName.toLowerCase() === stage.name.toLowerCase()
        console.log('singleStage.stageName: ', singleStage.stageName, 'stage.name: ', stage.name)
        return assess
      })
        console.log('STAGE_TASKS: ', stageTasks)

      let selectedTasks
      Object.entries(stageTasks).map(([key, stage]) => (
        selectedTasks = Object.entries(stage.tasks).map(([id, taskInfo]) => {
          // console.log('stageName', stage.stageName)
          return { value: {...taskInfo}, label: taskInfo.name, stageName: stage.stageName}
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
    newTask.name = taskName
    newTask.hoursPredicted = {}
    console.log('ADDING_TASK: ', newTask)
    
    dispatch({ type: "ADD_TASK", payload: { stageName: stageName, task: newTask} })
    
    handleClose()
  }

  function handleSelectedTask(task) {
    console.log('task: ', task)
    setSelectedTask(task)
    setTaskName(task.label)
    
  }


    return (
        <>
        <div className='labourList-StageTask' >
            <button className='task-container'
                onClick={createTaskOption}>
                + Add Task (in progress...)
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
            
            <FormInput label='Name' 
                        value={taskName} 
                        onChange={setTaskName}/>
            
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