import React from 'react';
import './ProgressBar.css'

function ProgressBar({ initial, warning, progress }) {
    function toPercent(value){
        value = value > 103 ? 103 : value
        return value + "%"
    }
    return (
            < div className="progressbar" >
                <div className="progress-initial" 
                    style={{width: toPercent(initial)}}
                    data-testid='initial'
                    />
                <div className="progress-warning" 
                    style={{width: toPercent(warning)}}
                    data-testid='warning'
                    />
                <div className="progress-progress" 
                    style={{width: toPercent(progress)}}
                    data-testid='progress'
                    />
            </div>
    )
}

//FUNCTIONS
function calculateTaskClaimed(task){
    let totalClaimed = 0;
    //console.log('task: ', task)
    if(task.claims){
    Object.entries(task.claims).map(([key, claim]) => totalClaimed += parseFloat(claim) )
    } else {
        totalClaimed = 0  
    }
    return totalClaimed 
}

//calculate stage completion
const calculateStageProgress = (stage) => { 
    let totalCost = 0;
    let totalClaimed = 0;
    let totalNextClaim = 0
    stage.tasks.forEach( task => {
        //console.log('StageProgressTask: ', task)
        totalCost += parseFloat(task.calculatedamount);
        totalClaimed += parseFloat(calculateTaskClaimed(task));
        totalNextClaim += task.nextClaim ? parseFloat(task.nextClaim) : 0;
    })
            

    let results = {"totalCost": totalCost, "totalClaimed": totalClaimed, "totalNextClaim": totalNextClaim}

    return results
}

const calculateProjectProgress = (project) => {
    let totalClaimed = 0
    let totalCost = 0
    let totalNextClaim = 0
    project.mainList.forEach( stage => {
        const stageSums = calculateStageProgress(stage)
        totalClaimed += stageSums.totalClaimed
        totalCost += stageSums.totalCost
        totalNextClaim += stageSums.totalNextClaim
    })    
    return { "totalClaimed": totalClaimed, "totalCost": totalCost, "totalNextClaim": totalNextClaim}    
}  

//LABOUR LIST
const calculateStageLabour = (stageTasks, team) => {
    console.log('STAGE_TASKS', stageTasks, 'TEAM', team)
    let result = {
        stageDays: 0.0,
        stageCost: 0.0,
        team: {},
    }
    

    //Object.entries(stageTasks).map(task => {
    stageTasks.forEach(task => {
        Object.entries(task.hoursPredicted).forEach(
            ([role, days]) => {
                days = parseFloat(days)
                if( days > 0) { 
                    let payRate = 0.0
                    result.team[role] ? result.team[role] += days : result.team[role] = days
                    result.stageDays += days

                    team.forEach(member => { if(member.role === role) {payRate = member.rate} });
                    //console.log('ROLE: ', role, ', DAYS: ', days, ', PAYRATE: ', payRate)
                    result.stageCost += days * payRate
                }
            }
        )
    })

    console.log('RESULT: ', result)
    return result
}


// function calculateTaskClaimed(task){
//     let totalClaimed = 0;
//     //console.log('task: ', task)
//     if(task.claims){
//     Object.entries(task.claims).map(([key, claim]) => totalClaimed += parseFloat(claim) )
//     } else {
//         totalClaimed = 0  
//     }
//     return totalClaimed 
// }

export { ProgressBar, 
        calculateTaskClaimed, 
        calculateStageProgress, 
        calculateProjectProgress,
        calculateStageLabour,
        }