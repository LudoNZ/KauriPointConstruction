import { useState } from "react"

//styles
import './library.css'
import { useReducer } from "react"
import { FormInput } from "../create/Create"
import { useFirestore } from "../../hooks/useFirestore"

function labourListReducer(reLabourList, action) {
    console.log('REDUCER: ', action)
    let modList = [...reLabourList]
    switch(action.type){
        case 'ADD_TASK':
            return modList.map(stage => {
                if( stage.name == action.payload.stageName ){
                    return {
                        ...stage,
                        tasks:[
                            ...stage.tasks,
                            action.payload.task,
                        ]
                    }
                }
                return { ...stage }
            })

            case "DELETE_TASK":
                return modList.map(stage => {
                if( stage.name == action.payload.stageName ){
                    return {
                        ...stage,
                        tasks:[
                            ...stage.tasks,
                            action.payload.task,
                        ]
                    }
                }
                return { ...stage }
            })

        default:
            return reLabourList
    }
}

const AddTask = ({dispatch, stageName}) => {
    const [taskName, setTaskName] = useState('')

    const handleAddTask = async() => {
        const payload = {
            stageName: stageName,
            task: {name: taskName}
        }
        dispatch({type:'ADD_TASK', payload:payload})
    }
    return (
        <div className="flex">
            <FormInput label='new Task:' 
                        value={taskName} 
                        onChange={(e) => {setTaskName(e)}}/>
            <button onClick={handleAddTask} className='btn-green'>Add Task</button>
        </div>
    )
}

const StageCard = ({stage, dispatch}) => {
    const [expandCard, setExpandCard] = useState(false)

    const handleExpand = () => {
        setExpandCard(!expandCard)
    }

    return (
        <div className="card">
            <h2 className="title" onClick={handleExpand}>{stage.name}</h2>
            
            {expandCard && (
                <div>
                    <AddTask stageName={stage.name} dispatch={dispatch} />
                    {stage.tasks.map(task => <div className='task' key={task.name}>{task.name}</div>)}
                </div>)
            }
        </div>
    )
}

export default function LabourList({list}) {
    const { updateDocument, response } = useFirestore('taskLibrary')

    const [reLabourList, dispatch] = useReducer(labourListReducer, list) 
    console.log('LABOURLIST: ', reLabourList)

    const handleSave = async(reList) => {
        const labourList = {
            stages: reList
        }
        console.log('UPDATING LABOUR LIST:', labourList )
        await updateDocument('labourList', labourList)
    }
    return(
        
        <div>
            {reLabourList && (
            <>
                <div className='btn-green' onClick={()=>handleSave(reLabourList)} > Save Changes </div>
                {reLabourList.map(stage => <StageCard stage={stage} key={stage.name} dispatch={dispatch}/>)}
            </>)}
        </div>
    )
}