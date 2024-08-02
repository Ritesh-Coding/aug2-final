
import React, { useEffect, useState  } from 'react';
import useAxios from '../../../hooks/useAxios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useMemo } from 'react';
import styled from 'styled-components';
import CalenderHolidays from '../UI/CalenderHolidays';
import "./page.css"
const Nav = styled.div`
  background: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Calender = () => {
  const localizer = momentLocalizer(moment)
  const [data,setData] = useState([])
  const [birthdayData,setBirthdayData]= useState([])
  const [calenderType,setCalenderType]=useState("leaveCalender")
  let eventList = []
  let birthDayEventList = []
  const {views, ...otherProps} = useMemo(() => ({
    views: {
        month: true
    }
}), [])
  const axiosInstance = useAxios()
  const fetchCalenderData=(calenderType)=>{
    if (calenderType == "leaveCalender")
    {
      document.getElementById("calenderBtn").style.opacity=1
      document.getElementById("birthdayBtn").style.opacity=0.5
      axiosInstance.get(`calender-leaves/?status=Approved`).then((res)=>{      
      setData(res.data)
    })
    }
    else if (calenderType == "birthDayCalender"){
      document.getElementById("birthdayBtn").style.opacity=1
      document.getElementById("calenderBtn").style.opacity=0.5
      axiosInstance.get(`api/calender-birthdays/`).then((res)=>{      
        setBirthdayData(res.data)
      })
    }
    
  }

  useEffect(()=>{
    fetchCalenderData(calenderType)   
  },[calenderType])
  if (calenderType==="leaveCalender")
    {
      console.log("Inside the leaves")
  data.map((leaves)=>{     
      let newEvent = {
        start: leaves.date,
        end: leaves.date,
        title : leaves.first_name
      }      
      eventList.push(newEvent)
  })
}
else{
  console.log("Inside the birthday")
  birthdayData.map((leaves)=>{   
    console.log(leaves)
    let newEvent = {
      start: leaves.dob,
      end: leaves.dob,
      title : leaves.first_name
    }      
    birthDayEventList.push(newEvent)
})
}

  let calendarShow=``
  switch(calenderType)
  {
      case "leaveCalender":
        calendarShow =  <Calendar
              selectable
              defaultView="month"
              views={views}
              defaultDate={new Date()}
              localizer={localizer}
              events={eventList}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}  
              /> 
          break

      case "birthDayCalender":
       calendarShow = <Calendar
          selectable
          defaultView="month"
          views={views}
          defaultDate={new Date()}
          localizer={localizer}
          events={birthDayEventList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}  
          />
        break
  }
  return (
    <> 
    <Nav>
        <div className="navbar">                 
              <button className="btn btn-success" id="calenderBtn" onClick={()=>{setCalenderType("leaveCalender")}}>Leave Calender</button>
              <button class="btn btn-success" id="birthdayBtn" onClick={()=>{setCalenderType("birthDayCalender")}}>BirthDay Calender</button>
        </div> 
    </Nav>
     <div className='calender'>     
     <div style={{marginLeft:`260px`,marginTop:`40px`,width:`60%`}}>
              {calendarShow}
        </div> 
        <div>
            <CalenderHolidays />
        </div>    
         
     </div>
        </>
  )
}

export default Calender