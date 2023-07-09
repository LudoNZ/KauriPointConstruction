import React, { useState } from "react"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserRole } from '../../hooks/useUserRole'

import ProjectUpdateMainList from "./projectUpdate/ProjectUpdateMainList"


// styles
import './ProjectDetail.css'
//import CreateMainList from "../create/CreateMainList"

export default function ProjectDetail({project}) {
  const { user, authIsReady } = useAuthContext()
  const userRole = useUserRole(user)

  // const startDate = "DATE"
  const startDate = project.startDate ? project.startDate.toDate().toDateString() : "undefined"
  const details = project.description ? project.description : '-' 
  const subContractFee = project.subContractFee ? project.subContractFee * 100 + '%' : '-'
  const [ switchUpdateMainlist, SetSwitchUpdateMainlist ] = useState(false)

  // Switches for Main and Labour components
  const handleSwitchUpdateMainlist = () => {
    SetSwitchUpdateMainlist(!switchUpdateMainlist)
  }


  return (
    <div className="project-detail">
      <div className="project-summary">
        
        <ProjectUpdateMainList project={project} SetSwitchUpdateMainlist={handleSwitchUpdateMainlist} switchUpdateMainlist={switchUpdateMainlist}/>

        <h3 className="project-detail-header">Project Detail</h3>
        <p className="due-date">
          Start date: {startDate}
        </p>
        <p>Sub Contract Fee: {subContractFee}</p>
        <p>Descriptions:</p>
        <p className="details">{details}</p>
        
        <p>Staff Rate:</p>
        <table className="team-table">
          <tbody>
          <tr>
            <th>Staff</th>
            <th>Role</th>
            <th>Rate</th>
            <th>9.5H</th>
            <th>Week</th>
            <th>Month</th>
          </tr>
          {project.team ? Object.entries(project.team).map( ([key, member]) => {
            return (
              (member.name &&
              <React.Fragment key={key}>
                  <tr>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>$ {member.rate}</td>
                      <td>$ {parseFloat(member.rate) * 9.5 }</td>
                      <td>$ {parseFloat(member.rate) * 45 }</td>
                      <td>$ {parseFloat(member.rate) * 180 }</td>
                  </tr>
              </React.Fragment>
              )
            )
            }) : <p>No team staff assigned...</p>}
          </tbody>
             
        </table>
       </div>
    </div>
  )
}