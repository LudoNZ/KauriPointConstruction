import LabourList from '../../components/LabourList'

// styles
import './ProjectLabourList.css'


export default function ProjectLabourList({project, setSwitchUpdateLabourList, switchUpdateLabourList}) {
  // console.log('labour List: ', project.labourList)
  return (
    <div className="project-detail">
        <h3>Labour Cost Breakdown</h3>
        <div className="project-labour-list">
          <LabourList project={project} switchUpdateLabourList={switchUpdateLabourList} setSwitchUpdateLabourList={setSwitchUpdateLabourList}/>
        </div>    
    </div>
  )
}
