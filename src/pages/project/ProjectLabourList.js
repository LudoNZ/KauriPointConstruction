import LabourList from '../../components/LabourList'

// styles
import './ProjectLabourList.css'


export default function ProjectLabourList({project}) {
  // console.log('labour List: ', project.labourList)
  return (
    <div className="project-detail">
        <h3>Labour Cost Breakdown</h3>
        <div className="project-labour-list">
          <LabourList labourList={project.labourList} team={project.team} />
        </div>    
    </div>
  )
}
