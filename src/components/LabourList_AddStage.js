import { useState, useEffect } from 'react'
import { useDocument } from '../hooks/useDocument'
import Modal from "react-overlays/Modal"
import Select from 'react-select'

export default function LabourListAddStage({stage, dispatch}) {
  //Modal
  const [showModal, setShowModal] = useState(false)
  const [formError, setFormError] = useState(null)

  // Firebase
  const { error, document } = useDocument('taskLibrary' , 'labourList')

  // Adding a stage and task in state (reStage)
  const [stageOptions, setStageOptions] = useState([])
  const [selectedStage, setSelectedStage] = useState()
  const [switchTaskOption, setSwitchTaskOption] = useState(false)
  const [taskOptions, setTaskOptions] = useState([])
  const [selectedTask, setSelectedTask] = useState()


  // Modal display functions
  const handleClose = () => {
    setSwitchTaskOption(false)
    setShowModal(false)
  }
  const renderBackdrop = (props) => <div className="backdrop" {...props} />

  function createStageOption() {
    // Store the tasks currently in the state 
    const stageListCurrentlySelected = Object.entries(stage).map(([key, stageName])=> {
      return stageName.name
    })
    // console.log('stageListHasSelected', stageListCurrentlySelected) 
    
    const allStages = Object.values(document.stages).map(libStages => {
        return { label: libStages.name, value: libStages.tasks }       
    })
    console.log('val ALLSTAGES: ', allStages)

    let filteredStage = allStages.filter(function(singleStage) {
      return !stageListCurrentlySelected.includes(singleStage.label)
    })
    console.log( 'val FILTEREDSTAGE:', filteredStage)
    // console.log('allStages',allStages)
    // console.log('filteredStage',filteredStage)
    setStageOptions(filteredStage)
    setShowModal(true)
  }

  // console.log('selectedStage, outside of useEffect',selectedStage)
  function createTaskOption(option) {
    setSelectedStage(option)
    setSwitchTaskOption(true)
  }

  useEffect(() => {


      if(selectedStage){
        // Creat task options (second options) 
        console.log('SELECTED_STAGE:', selectedStage)
        
        let setTasks = Object.values(selectedStage.value).map( task => {
            console.log('VALUE_TASK: ', task)
          return {...task, label: task.name}       
        })
        setTaskOptions(setTasks)

    }
    
  }, [selectedStage])

  function handleSubmit(e) {
    e.preventDefault()
    // setFormError(null)

    // console.log('selectedTask', selectedTask)
    const extractTasksValue = Object.values(selectedTask).map(task => {
      return { name: task.label, hoursPredicted: {} }
    })
    console.log('EXTRACTED TASK VALUE: ', extractTasksValue)
    // console.log('extractTasksValue', extractTasksValue)
    dispatch({ type: 'ADD_STAGE', 
      payload: { stage: selectedStage.label, tasks: extractTasksValue } })
      // payload: { stageAndTask: selectedStageAndTask } })
    setSelectedStage()
    handleClose()
  }

  return (
    <>
      <div>
        <button type="btn" onClick={createStageOption}>
          + Add Stage
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
                  Add New Stage<br /> 
                  
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
              <label>
                <h3 className='modal-label'>Stage:</h3>
                <Select
                  className='inputSelector'
                  // onChange={(option) => setSelectedStage(option)}
                  onChange={(option) => createTaskOption(option)}
                  options={stageOptions}
                />
              </label>
                { switchTaskOption && 
                <label>
                  <h3 className='modal-label'>Tasks:</h3>
                      <Select
                        className='inputSelector'
                        isMulti
                        onChange={(taskOption) => {
                            console.log('TASK_OPTION: ', taskOption)
                            setSelectedTask(taskOption)}}
                        options={taskOptions}
                      />
                </label>
                }


                <div className="modal-footer">
                <div>
                  <button className="btn-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>

                <div>
                  <button className="btn">
                    Add Stage and Task
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

