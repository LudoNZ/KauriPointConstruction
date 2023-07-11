import { timestamp } from '../../firebase/config'

//TO CONVERT IMPORTED LISTS TO ARRAYS


export function ConvertToList(List) {
    console.log('List: ', List)
    let newMainList = []
    Object.entries(List).map( ([key, stage]) => {
        console.log('mod stage: ', key, stage);

        Object.entries(stage).map( ([key,stage]) => {
            //console.log('2nd key: ', key, '2ndStage: ', stage)
            let newStageTasks = [];

            Object.entries(stage).map( ([key, task]) => {
                //console.log('key: ', key, ' task: ', task)
                newStageTasks.push(task);
                return ;
            })
            let newStage = { name:key, tasks:newStageTasks }
            newMainList.push(newStage)
            console.log('new mainList: ', newMainList )
            return ;
        })
        
        return
    })

    //console.log('New Main List:', newMainList)

    return newMainList
}
export function ConvertProjectLabourList(List) {
//used to prep Full Labour List Library for import
    console.log('INITIAL LIST: ', List)
    let newLabourList = []
    Object.entries(List).forEach( ([key, stage]) => {
        console.log('key1: ', key, 'STAGE: ', stage)
        
        Object.entries(stage).forEach( ([key, tasks]) => {
            console.log('key2 STAGENAME: ', key, 'TASKS: ', tasks)
            let newStageTasks = [];
            
            Object.entries(tasks).forEach( ([key, task]) => {
            console.log('key3: ', key, 'TASK: ', task)
                newStageTasks.push(task);
            })
            
            let newStage = { name:key, tasks:newStageTasks }
            newLabourList.push(newStage)
        })
    })

    console.log('NEW LABOUR_LIST: ', newLabourList)
    return newLabourList
}

export function ConvertLabourList(List) {
//used to prep Full Labour List Library for import
    console.log('List: ', List)
    let newLabourList = []
    Object.entries(List).map( ([key, stage]) => {
        const stageName = key
        let newStageTasks = [];

        Object.entries(stage).map( ([key,task]) => {
            console.log('key: ', key, 'task: ', task)
            newStageTasks.push(task);

            return ;
        })
        
            let newStage = { name:key, tasks:newStageTasks }
            newLabourList.push(newStage)
            return ;
        })
        
        console.log('NEW LABOUR_LIST: ', newLabourList)
    
        return newLabourList
    }

function convertTeamToList(teamDict){
    console.log('teamDict: ', teamDict)
    let newteamDict = []
    Object.entries(teamDict).map( ([key, member]) => {
        newteamDict.push(member);
        return ;
    })
    
    console.log('new teamDict: ', newteamDict )
    return newteamDict ;
}

export default function modifyData(project) {
    
    project.mainList = ConvertToList(project.mainList)
    project.labourList = ConvertProjectLabourList(project.labourList)
    project.team = convertTeamToList(project.team)
    project.projectStatus = 'upcoming'
    project.startDate = timestamp.fromDate(new Date())


    console.log('PROJECT:', project)
    return project
}

export { modifyData }