//import dayjs from 'dayjs';
import { Link } from 'react-router-dom'
import { ProgressBar, calculateProjectProgress } from '../../components/progressBar/ProgressBar'
//functions
import {calculateTaskClaimed, calculateStageProgress} from '../../components/progressBar/ProgressBar'

// styles
import './ProjectSummary.css'
import { useState } from 'react';
import React from 'react';

export default function ProjectSummary({ projects }) {

  return (
    <div className="project-summary">
      {projects.length === 0 && <p>No project</p>}
      {projects.map(project => {
        const results = calculateProjectProgress(project);
        const claimed = results.totalClaimed / results.totalCost * 100
        const NextClaim = ( results.totalNextClaim + results.totalClaimed) / results.totalCost * 100
        return (
          <ProjectListCard key={project.id} project={project} claimed={claimed} warning={NextClaim}/> 
      )})}
    </div>
  )
}

function ProjectListCard({project, claimed, warning}) {
  const [expandProjectListCard, setExpandProjectListCard] = useState(false) 

  const handleExpandProjectListCard = () => {
    setExpandProjectListCard(!expandProjectListCard)
  }

//<p>{dayjs(project.startDate.toDate()).format('DD/MMM')}</p>
  return (
    <>
    <div className='projectListCard'>
      <div className='title'>
        {expandProjectListCard ? <div className='arrow-down' onClick={handleExpandProjectListCard}/>
                              : <div className='arrow-right' onClick={handleExpandProjectListCard}/>}
        
        <Link to={`/project/${project.id}`} key={project.id}>
          <h4>{project.name}</h4>
        </Link>
       
      </div>
        <ProgressBar initial={claimed} warning={warning} progress={claimed} />
        
    </div>
    {expandProjectListCard && <CardMainList mainList={project.mainList} />}
    {expandProjectListCard && <CardLabourList labourList={project.labourList} />}
    </>
  )
}

//MAIN LIST
function CardMainList({mainList}) {
  const [expandList, setExpandMainList] = useState(true)

  const HandleCollapseMainList = () => {
    setExpandMainList(!expandList)
  }
  
  return (
    <div className='cardMainList'>
      <h4 onClick={HandleCollapseMainList}>MainList</h4>

      { Object.entries(mainList).map( ([key,stage]) => {
        const stageStats = calculateStageProgress(stage)
        const stageClaimed = stageStats.totalClaimed / stageStats.totalCost * 100
        return (
          <React.Fragment key={key}>
            {expandList &&
                <div key={key}> 
                  <CardStageTasks stageName={stage.name} stageTasks={stage.tasks} stageClaimed={stageClaimed}/>
                </div>
            }
          </React.Fragment> 
        )
      })}

    </div>
  )
}

function CardStageTasks({stageName, stageTasks, stageClaimed}) {
  const [expandStage, setExpandStage] = useState(false) 

  const ToggleExpandStage = () => {
  setExpandStage(!expandStage)
}
  //console.log('stageTasks: ', stageTasks)

  return(
    <div>
      <div className='cardStage-stageHeader'>
        <h3 onClick={ToggleExpandStage} className='cardStage-stageName'>{stageName}</h3> 
        <ProgressBar progress={stageClaimed} />
      </div>

      {expandStage && 
        Object.entries(stageTasks).map( ([key, task]) => {

          const claimed = calculateTaskClaimed(task)/ parseInt(task.calculatedamount) * 100

          return (
            <div className='cardStageTasks' key={key}>
              <span className='cardStagetask-name'>{task.task}</span>
              <ProgressBar progress={claimed}/>
              <span className='cardStagetask-status'>{task.status}</span>
            </div>
      )
        
      })}

    </div>
  )
}


//LABOUR LIST
function CardLabourList({labourList}) {
  const [expandLabourList, setExpandLabourList] = useState(false)

  const HandlesetExpandLabourList = () => {
    setExpandLabourList(!expandLabourList)
  }

  return (
    <div className='cardMainList'>
      <h4 onClick={HandlesetExpandLabourList}>Labour List</h4>
      {expandLabourList && 
        Object.entries(labourList).map( ([key, stage]) => {
          return(<div key={key}>{
                <React.Fragment key={key}>
                  <CardLabourListTasks stage={stage} />
                </React.Fragment>
            }</div>)
        })}   
    
    </div>
  )
}


function CardLabourListTasks({ stage }) {
  const [expandLabourStage, setExpandLabourStage] = useState(false) 

  const ToggleExpandLabourStage = () => {
    setExpandLabourStage(!expandLabourStage)
}

  let stageName = stage.name ? stage.name : '-'
  return(
    <div>
      <div className='cardStage-stageHeader'>
        <h3 onClick={ToggleExpandLabourStage} className='cardStage-stageName'>{stageName}</h3> 
      </div>

      {expandLabourStage && 
        Object.entries(stage.tasks).map( ([key, task]) => {

          return (
            <div className='cardStageTasks' key={key}>
              <span className='cardStagetask-name'>{task.name}</span>
            </div>
      )
        
      })}

    </div>
  )
}