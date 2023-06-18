import './ClaimsList.css'

import { numberWithCommas } from '../../pages/project/ProjectFinancialInfo'

export default function ClaimsList ({ project }) {

    let claimList = updateClaims(project.mainList)

    console.log('claimList:', claimList)

    return (
        <div>
            <h1>Project Claims:</h1>

            {claimList 
            
                ? <div>{Object.entries(claimList.submittedClaims).map(([key, claim] ) => {
                    return (
                        <div key={key}>
                            <p><strong>claim: {key}</strong></p>
                            <div>{Object.entries(claim.tasks).map( ([key, task]) => {
                                return (
                                    <div key={key} className='flex'>
                                        <p>{task.task.task}</p>
                                        <p>${task.value}</p>
                                    </div>
                                )
                            })}</div>
                        </div>
                    )
                })}</div> 
                
                : <p>NO CLAIMS</p>}

                <button className='btn' onClick={() => updateClaims(project.mainList)}>Update Claims</button>
        </div>
    )
} 

// collect claim info from mainList tasks and update the claims collection
function updateClaims( mainlist ) {
    let projectClaims = {
        submittedClaims: {},
        nextClaim: {},
    }

    console.log('MAINLIST: ', mainlist )

    mainlist.forEach(stage => {
        stage.tasks.forEach(task => {
            if(task.claims) {
                Object.entries(task.claims).forEach( ([claim, value]) => {
                    console.log('TASK_NAME:', task.task, ', CLAIM:', claim, ', VALUE:', value)
                    
                    
                    projectClaims.submittedClaims[claim] 
                        //if claim exists
                        ? projectClaims.submittedClaims[claim].tasks.push({
                                task: task,
                                value: value,
                                })
                        //if claim doesnt exist yet
                        : projectClaims.submittedClaims[claim] = {                                
                            tasks: [{
                                task: task,
                                value: value,
                                },]
                        }
                return
                })
            }
        })
           
    })

    console.log('projectClaims:', projectClaims)
    
    return projectClaims

}