import React from 'react'
import "../pages/page.css"
interface EmployeeActivitiesProps {
  firstName: string;
  status: string;
  statusTime: string; 
}
const formatDate = (dateString : string) => {
  const options : Intl.DateTimeFormatOptions  = { hour: '2-digit', minute: '2-digit'}
  return new Date(dateString).toLocaleString(undefined,options)
}
const EmployeeActivities : React.FC<EmployeeActivitiesProps>= (props) => {
  let statusTime =  formatDate(props.statusTime)
// console.log("Format time",new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(props.statusTime));
  return (
    <div>
        <pre>{props.firstName}    {props.status}     {statusTime}</pre>
    </div>
  )
}

export default EmployeeActivities