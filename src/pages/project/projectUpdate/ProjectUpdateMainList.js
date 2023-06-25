import { useState, useReducer } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useUserRole } from '../../../hooks/useUserRole'
import { useFirestore } from '../../../hooks/useFirestore'

import { ProgressBar, calculateStageProgress, calculateTaskClaimed } from '../../../components/progressBar/ProgressBar'
import { numberWithCommas } from '../ProjectFinancialInfo'

import UpdateTaskStatus from './components/UpdateTaskStatus'
import AddStage from './components/AddStage'
import AddTask from './components/AddTask'

//styles
import '../../../components/MainList.css'
import './ProjectUpdateMainList.css'
import CreateNewStage from './components/CreateNewStage'
import ClaimOnTask from './components/ClaimOnTask'

export const ACTIONS = {
    CREATE_STAGE: 'create_stage',
    ADD_STAGE: 'add_stage',
    ADD_TASK: 'add_task',
    CHANGE_STATUS: 'change_status',
    DELETE_STAGE: 'delete_stage',
    DELETE_TASK_ITEM: 'delete_task_item',
    RESET: 'reset',
    MAKE_CLAIM: 'make_claim',
}

function mainListReducer(reStages, action) {
  let stageTask
  let newTask
  //let taskIndex
  let newTaskArr
  // console.log('reducer payload', tasks, name)
  switch(action.type){

    case ACTIONS.MAKE_CLAIM:
      stageTask = [...reStages]

      stageTask.forEach(stage => {
          if (stage.name == action.stageName) {
            stage.tasks[action.index].nextClaim = action.payload.nextClaim
            //console.log('CLAIMED AT: ', action.stageName, ' task:' ,action.index)
          }
          return
      })

      return stageTask


    case ACTIONS.CREATE_STAGE:
      stageTask = [...reStages]
      stageTask.push(action.payload.newStage)
      return stageTask

    case ACTIONS.ADD_STAGE:
      const name = action.payload.stage
      const tasks = action.payload.tasks
      // console.log('Reducer')
      stageTask = [...reStages]
      stageTask.push({ name, tasks })
      return stageTask

    case ACTIONS.ADD_TASK:
      return reStages.map(stage => {
        // console.log('reducer', action.payload.stageName)
        // console.log('action.payload.taskList', action.payload.taskList)
        // console.log('stage', stage)
        if(stage.name === action.payload.stageName )
          return {
            ...stage,
            tasks: [
              ...stage.tasks, 
              action.payload.task,          
              // action.payload.taskList.map(details => {return {...details}})          
            ]}
        return { ...stage }
    })

    // Change task details
    case ACTIONS.CHANGE_STATUS:
      stageTask = [...reStages]

      const deleteTask =  stageTask.map(stage => {
        // console.log('action.payload.task', action.payload.task)
        // console.log('stage.tasks', stage.tasks)
      return {   
        ...stage,
        tasks: 
          stage.tasks.filter(task => task.task !== action.payload.task.task)
            .map(task => {
              return {...task}
          })    
        }
      })
      // console.log('deleteTask', deleteTask) 
      // const newTaskArr = action.payload.task
      newTask = {
        ...action.payload.task,
        // ...action.payload.taskDetails.map(singleItem => {return singleItem})
        subcontractor: action.payload.subcontractor,
        details: action.payload.details,
        subcontractedamount: action.payload.subcontractedamount,
        calculatedamount: action.payload.calculatedamount,
        status: action.payload.status,
        quoteEstimateOrProvision: action.payload.quoteEstimateOrProvision
        // ...action.payload.task,
        //status: action.payload.task.status,
        //calculatedamount: action.payload.task.calculatedamount
      }

      console.log('new Task',newTask)
      return deleteTask.map(stage => {
        // console.log('reducer', action.payload.stageName)
        // console.log('action.payload.taskList', action.payload.taskList)
        // console.log('stage', stage)
        //taskIndex = action.payload.index
        // console.log(taskIndex)
        // console.log('action.payload.stageName', action.payload.stageName)
        // console.log('stage.name', stage.name)
        // console.log('newTaskArr',newTaskArr)
        if(stage.name === action.payload.stageName ){
          newTaskArr = stage.tasks
          newTaskArr.splice(action.payload.index, 0, newTask)
          return {
            ...stage,
            tasks: 
              newTaskArr.map(replacetask => {return {...replacetask}})        
              // action.payload.taskList.map(details => {return {...details}})          
          }
        }
        return { ...stage }
    })

    case ACTIONS.DELETE_STAGE:
      console.log('payload', action.payload.stageName);
      return reStages.filter(stage => stage.name !== action.payload.stageName)
        .map(stage => {
          return {...stage}
      })
      // return reStages

    case ACTIONS.DELETE_TASK_ITEM:
    return reStages.map(stage => {
        // console.log('action.payload.task', action.payload.task)
        // console.log('stage.tasks', stage.tasks)
      return {   
        ...stage,
        tasks: 
          stage.tasks.filter(task => task.task !== action.payload.task)
            .map(task => {
              return {...task}
          })    
      }
    })

    case ACTIONS.RESET:
      return action.payload

  default:
    return reStages
  }
}

const TaskSectionData = ({label, value}) => {
  return (
      <div className='TaskSectionData'>
          <span className='TaskSectionData-label'>{label}: </span> 
          <span className='TaskSectionData-value'>{value}</span>
      </div>
  )
}

function TaskSection({task}) {
  return (
      <div className='TaskSection'>
          <TaskSectionData label='Code' value={task.code}/>
          <TaskSectionData label='Details' value={task.details}/>
          <TaskSectionData label='Quote, Estimate or Provision' value={task.quoteEstimateOrProvision}/>
          <TaskSectionData label='comment' value={task.comment}/>
      </div>
  )
}

// function TaskDetails({stageKey, index, task, dispatch}) {
function TaskDetails({stageName, index, task, dispatch, switchUpdateMainlist}) {
  const [expandTask, setExpandTask] = useState(false) 

  const handleExpandTask = ()=>{
      setExpandTask(!expandTask)
  }
  const taskName = task.task ? task.task : ' -'
  const subContractor = task.subcontractor ? task.subcontractor : " -"
  const calculatedamount= task.calculatedamount ? numberWithCommas(parseFloat(task.calculatedamount)) : ' -'
  const status = task.status ? task.status : ' -'
  const claimed = calculateTaskClaimed(task) > 0 ? numberWithCommas(calculateTaskClaimed(task)) : '-'
  const percentageComplete = (calculateTaskClaimed(task) / parseFloat(task.calculatedamount)) * 100
  const nextClaim = task.nextClaim ? parseFloat(task.nextClaim) : 0
  const percentageClaimed = ( ( calculateTaskClaimed(task) + nextClaim ) / parseFloat(task.calculatedamount)) * 100

  return (
      <>
      <div className='mainlist-task'>
          <span onClick={handleExpandTask} className={expandTask ? 'arrow-down' : 'arrow-right' }/>
          <span className='mainlist-taskHeader-name'>
              <div>{taskName}</div>
              <ProgressBar progress={percentageComplete}  warning={percentageClaimed} />
          </span>
          <span className='mainlist-taskHeader-subContractor'>{subContractor}</span>
          <div className='mainlist-taskHeader-cost space'>
            
            {switchUpdateMainlist && 
              <ClaimOnTask stageName={stageName} index={index} task={task} dispatch={dispatch}/>
            }
            <span className=''>{claimed} / {calculatedamount}</span>
          </div>
          <span className='mainlist-taskHeader-status'>{status}
          
            {/* <UpdateTaskStatus stageKey={stageKey} index={index} task={task} dispatch={dispatch} /> */}
            {switchUpdateMainlist &&
              <UpdateTaskStatus stageName={stageName} index={index} task={task} dispatch={dispatch} />
            }
              </span>
      </div>
      <div>
      {expandTask && <TaskSection task={task}/>}
      </div>
      </>
  )
}

function Tasks ({ stageName, stage, dispatch, switchUpdateMainlist }) { 
return(
  
    <div className='mainList-stageTasks'>
      <div className='mainlist-taskHeader'>
          <span className='mainlist-taskHeader-name'>Task Items</span>
          <span className='mainlist-taskHeader-subContractor'>SubContractor</span>
          <span className='mainlist-taskHeader-cost'>Claimed / Cost</span>
          <span className='mainlist-taskHeader-status'>Status</span>
      </div>
      {Object.entries(stage).map( ([key, task]) => {
          return (
              <TaskDetails stageName={stageName}
                          key={key}
                          index={key} 
                          task={task}
                          dispatch={dispatch}
                          switchUpdateMainlist={switchUpdateMainlist}
                          />
          )
      })}
    </div>
  )
}

// function Stage({ stageKey, stage, dispatch }) {
function Stage({ stage, dispatch, userRole, switchUpdateMainlist }) {
  const [expandStages, setCollapseStages] = useState(false)
  
  function handleExpand() { setCollapseStages(!expandStages)}

  function handleDeleteStage(e) {
    const stageName = e.target.value
    dispatch({ type: ACTIONS.DELETE_STAGE, payload:{ stageName: stageName }})
  }

  const stageFinancials = calculateStageProgress(stage)
  const stageCost = stageFinancials.totalCost
  const stageClaimed = stageFinancials.totalClaimed
  const stageProgress = (stageClaimed / stageCost) * 100
  const stageNextClaim = stageFinancials.totalNextClaim
  const NextClaimProgress = (( stageClaimed + stageNextClaim ) / stageCost) * 100

  // console.log('stage: ',stage)
  return (
    <div className='mainlist-stageCard'>
      <div onClick={handleExpand} className='mainlist-stageCard-header'>
        {expandStages? <div className='arrow-down' /> : <div className='arrow-right' />}
        <div className='stageCard-header-titleBar'>
          <h3>{stage.name}</h3>
          <ProgressBar progress={stageProgress} warning={NextClaimProgress}/>
          { (switchUpdateMainlist && (userRole ==="admin")) 
            && <div className='updateStage-footer'>
                <AddTask stage={stage} dispatch={dispatch} />
                <button value={stage.name} onClick={(e) => handleDeleteStage(e)}>- Delete Stage</button>
              </div>
            }
            
        </div>
      </div>

      {expandStages && <Tasks stageName={stage.name} stage={stage.tasks} dispatch={dispatch} switchUpdateMainlist={switchUpdateMainlist} />}
      
    </div>
  )
}

// Reducer setup here
export default function ProjectUpdateMainList({project, SetSwitchUpdateMainlist, switchUpdateMainlist }) {
  const { user, authIsReady } = useAuthContext()
  const userRole = useUserRole(user)

  const passMainlist = project.mainList
  const stages = passMainlist
  const [reStages, dispatch] = useReducer(mainListReducer, stages)
  const { updateDocument, response } = useFirestore('projects')

  const handleSubmit = async(e) => {
    e.preventDefault()
    const mainList = {
        mainList: reStages
    }

    console.log('UPDATING MAINLIST:', mainList)
    await updateDocument(project.id, mainList)

    if (!response.error) {
        //history.push('/')
        SetSwitchUpdateMainlist()
      }
  }

  const handleReset = () => {
    dispatch({ type: ACTIONS.RESET, payload: passMainlist})
    SetSwitchUpdateMainlist()
  }
  
  console.log("reStages", reStages)
  
  return (
    <div>
      <h2>Main List:</h2>
      <div className="update-mainlist">    
      { Object.entries(reStages).map( ([key, stage]) => {
        // console.log('stageKey',key)
        return <Stage stage={stage} dispatch={dispatch} key={key} userRole={userRole} switchUpdateMainlist={switchUpdateMainlist}/>
      })}
      <AddStage stage={stages} dispatch={dispatch} />
      <CreateNewStage stage={stages} dispatch={dispatch} />

      {switchUpdateMainlist 
        ?
        <div className='modal-footer sticky-bottom'>
          <button onClick={handleSubmit} className="btn " id="btn_right">Save All Changes</button>
          <button onClick={handleReset} className="btn-cancel" id="btn_right">Discard Changes</button>
        </div>
        : 
        <button className='sticky-bottom btn-white' onClick={() => {SetSwitchUpdateMainlist()}}>+ Update Main List</button>  
      }

      </div>
    </div> 
  )
}
