import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserRole } from '../../hooks/useUserRole'


import Sidebar from '../../components/Sidebar'
import ProjectClientInfo from './ProjectClientInfo'
import ProjectDetail from './ProjectDetail'
import ProjectLabourList from './ProjectLabourList'
import ProjectUpdateClientInfo from './projectUpdate/ProjectUpdateClientInfo'
import ProjectUpdateProjectDetail from './projectUpdate/ProjectUpdateProjectDetail'
import ProjectFinancialInfo from "./ProjectFinancialInfo"


// styles
import './Project.css'
import ClaimsList from '../../components/Claims/ClaimsList'
import ProjectUpdateMainList from './projectUpdate/ProjectUpdateMainList'


export default function Project() {
  const { id } = useParams()
  const { error, document } = useDocument('projects' , id)
  const { user, authIsReady } = useAuthContext()
  const [ switchList, SetSwitchList ] = useState("MAIN_LIST")
  const [switchUpdateLabourList, setSwitchUpdateLabourList] = useState(false)
  const [switchUpdateMainList, setSwitchUpdateMainList] = useState(false)

  
  const userRole = useUserRole(user)
  // console.log(userRole)
  
  if(error) {
    return <div className="error">{error}</div>
  }
  if(!document) {
    return <div className="loading">Loading...</div>
  }

  // Switches for Main and Labour components
  const handleSwitchList = (listName) => {
    SetSwitchList(listName)
  }

  const reSwitchUpdateLabourList = () => {
    setSwitchUpdateLabourList(!switchUpdateLabourList)
  }
  const handleSwitchUpdateMainlist = () => {
    setSwitchUpdateMainList(!switchUpdateMainList)
  }
  
  return (
    <div className='page-container'>
      <Sidebar />
      <div className='content-container'>
        <div className="project">      

          <ProjectClientInfo project={document}/>
          {userRole==="admin" &&
          <ProjectUpdateClientInfo project={document}/>}

          {/* Financial details */}
          <ProjectFinancialInfo project={document} />

          <div className={ !switchUpdateMainList ? (!switchUpdateLabourList ? 'tabs': 'tabs shrink') : 'tabs shrink'} >
            <div className='listSelector'>
              <button onClick={ () => handleSwitchList("MAIN_LIST") } className="btn" id={switchList === "MAIN_LIST" ? 'btn-active' : 'btn-disabled'}>MainList</button>
              <button onClick={ () => handleSwitchList("LABOUR_LIST") } className="btn" id={switchList === "LABOUR_LIST" ?'btn-active' : 'btn-disabled'}>LabourList</button>
              <button onClick={ () => handleSwitchList("CLAIM_LIST") } className="btn" id={switchList === "CLAIM_LIST" ? 'btn-active' : 'btn-disabled'}>Claims</button>
            </div>
            {switchUpdateLabourList && <span className='updating-alert'>!! SAVE LabourList CHANGES RECOMMENDED !!</span>}
            {switchUpdateMainList && <span className='updating-alert'>!! SAVE Main List CHANGES RECOMMENDED !!</span>}
          </div>        
          
          {(switchList === "MAIN_LIST") && 
            <>
              <ProjectUpdateMainList project={document} SetSwitchUpdateMainlist={handleSwitchUpdateMainlist} switchUpdateMainlist={switchUpdateMainList}/>
              
              <ProjectDetail project={document} />
              <ProjectUpdateProjectDetail project={document} />
            </>
          }
          {(switchList === "LABOUR_LIST") && <ProjectLabourList project={document} setSwitchUpdateLabourList={reSwitchUpdateLabourList} switchUpdateLabourList={switchUpdateLabourList}/>}

          {(switchList === "CLAIM_LIST") && <ClaimsList project={document}/>}

        </div>
      </div>
    </div>
  )
}