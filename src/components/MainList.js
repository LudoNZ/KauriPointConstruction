import { useState } from 'react'

//styles
import './MainList.css'

//components
import { ProgressBar, calculateStageProgress, calculateTaskClaimed } from './progressBar/ProgressBar'
import { numberWithCommas } from '../pages/project/ProjectFinancialInfo'

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

function TaskDetails({task}) {
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

    return (
        <>
        <div onClick={handleExpandTask} className='mainlist-task'>
            {expandTask ? <span className='arrow-down'/> : <span className='arrow-right'/> }
            <span className='mainlist-taskHeader-name'>
                <div>{taskName}</div>
                <ProgressBar progress={percentageComplete} />
            </span>
            <span className='mainlist-taskHeader-subContractor'>{subContractor}</span>
            <span className='mainlist-taskHeader-cost'>{claimed} / {calculatedamount}</span>
            <span className='mainlist-taskHeader-status'>{status}</span>
        </div>
        <div>
        {expandTask && <TaskSection task={task}/>}
        </div>
        </>
    )
}


function Tasks ({ stage }) { 
    // console.log("STAGE:", stage)
    return(
        <div className='mainList-stageTasks'>
            <div className='mainlist-taskHeader'>
                <span className='mainlist-taskHeader-name'>Task Items</span>
                <span className='mainlist-taskHeader-subContractor'>SubContractor</span>
                <span className='mainlist-taskHeader-cost'>Claimed / Cost</span>
                <span className='mainlist-taskHeader-status'>Status</span>
            </div>
            {Object.entries(stage).map( ([key,task]) => {
                return <TaskDetails key={key} task={task}/>
            })}
            </div>
        
    )
}

function Stage({ stage }) {
    const [expandStages, setCollapseStages] = useState(false)
    
    function handleExpand() { setCollapseStages(!expandStages)}

    const stageFinancials = calculateStageProgress(stage)
    const stageCost = stageFinancials.totalCost
    const stageClaimed = stageFinancials.totalClaimed
    const stageProgress = (stageClaimed / stageCost) * 100

    // console.log('stage: ',stage)
    return (
        <div className='mainlist-stageCard'>
            <div onClick={handleExpand} className='mainlist-stageCard-header'>
                {expandStages? <div className='arrow-down' /> : <div className='arrow-right' />}
                <div className='stageCard-header-titleBar'>
                    <h3 >{stage.name}</h3>
                    <ProgressBar progress={stageProgress}/>
                </div>
            </div>
            {expandStages && <Tasks stage={stage.tasks} />}
        </div>
    )
}

export default function MainList({ mainList }) {
    
    return (
            <div>
                <h2>Main List:</h2>
                
                { Object.entries(mainList).map( ([key, stage]) => {
                            return <Stage key={key} stage={stage} />
                })}
            </div> 
    )
}

