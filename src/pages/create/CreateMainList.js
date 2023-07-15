import React,{ useState } from 'react'
import MainList_db from './MainList_db.json'
import { useFirestore } from '../../hooks/useFirestore'

export default function CreateMainList() {
  // const { addDocument, response } = useFirestore('taskLibrary')
  const { updateArrDocument, response } = useFirestore('taskLibrary')
  const [formError, setFormError] = useState(null)

  const DBmainList = MainList_db
  let mainList = []
  
  function MainListCreator(){
    Object.entries(DBmainList).map(([key, lists]) => (
      Object.entries(lists).map(([stageName, stages]) => {
        const task =  {
              "name": stageName,
              "tasks":
              Object.entries(stages).map(([stage, tasks]) => {
                  return {...task}
                })
          }
        mainList.push(task)
        console.log('task',task)
        return task
        
      })
    ))  
  }  
                    
  let testArray = [1,2,3]
  console.log('testArr',testArray)
  MainListCreator()

  // taskLists = Object.entries(mainList).map(([key, stages]) => (
  //   Object.entries(stages).map(([k, taskList]) => {
  //     return taskList

  //   })
  // ))

  console.log('mainList',mainList)
  // console.log('taskList',taskLists)


  const handleSubmit = async(e) => {
    e.preventDefault()
    setFormError(null)
    if(!mainList){
      setFormError('Please select a task group')
      return
    }

    const tasks = {
      "stages": mainList       
    }

    // console.log('updateDoc',mainList)
    // await updateArrDocument('mainList', tasks)
    await updateArrDocument('mainList', tasks)
    // await addDocument(test)
  }

  return (
    <>
      <p>Hello</p>
      <button onClick={handleSubmit}>Send Mainlist</button>
    </>
  )
   
}
