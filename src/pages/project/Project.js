import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useDocument } from '../../hooks/useDocument'

import Sidebar from '../../components/Sidebar'
import ProjectClientInfo from './ProjectClientInfo'
import ProjectDetail from './ProjectDetail'
import ProjectLabourList from './ProjectLabourList'
import ProjectUpdateClientInfo from './projectUpdate/ProjectUpdateClientInfo'
import ProjectUpdateProjectDetail from './projectUpdate/ProjectUpdateProjectDetail'


// styles
import './Project.css'


export default function Project({document}) {
  const { id } = useParams()
  //const { error, document } = useDocument('projects' , id)
  const error = document ? null : 'Project Error';
  const [ switchLabourList, SetSwitchLabourList ] = useState(false)
  
  if(error) {
    return <div className="error">{error}</div>
  }
  if(!document) {
    return <div className="loading">Loading...</div>
  }

  // Switches for Main and Labour components
  const handleSwitchList = () => {
    SetSwitchLabourList(!switchLabourList)
  }

  return (
    <div className='page-container'>
      <div className='content-container'>
        <div className="project">      

          <ProjectClientInfo project={document}/>
          <ProjectUpdateClientInfo project={document}/>

          <div>
            <button onClick={ handleSwitchList } className="btn" id={switchLabourList ? 'btn-disabled' : 'btn-active'}>MainList</button>
            <button onClick={ handleSwitchList } className="btn" id={!switchLabourList ? 'btn-disabled' : 'btn-active'}>LabourList</button>
          </div>       
          {!switchLabourList && 
            <>
              <ProjectDetail project={document} />
              <ProjectUpdateProjectDetail project={document} />
            </>
          }
          {switchLabourList && <ProjectLabourList project={document} />}
        </div>
      </div>
    </div>
  )
}