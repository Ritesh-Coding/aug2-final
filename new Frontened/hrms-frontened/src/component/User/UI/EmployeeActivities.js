import React from 'react'
import "../pages/page.css"
const formatDate = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit'}
  return new Date(dateString).toLocaleString(undefined, options)
}
const EmployeeActivities = (props) => {
  let statusTime =  formatDate(props.statusTime)
// console.log("Format time",new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(props.statusTime));
  return (
    <div>
        <pre>{props.firstName}    {props.status}     {statusTime}</pre>
    </div>
  )
}

export default EmployeeActivities