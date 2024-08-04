import React from 'react'
interface Break {
    breakIn: string;
    breakOut: string;
  }
interface DailyLogsProps{
    checkIn:string
    breaks:Break[]   
    checkOut:string   
}
const formatDate = (dateString :string) => {
    const options : Intl.DateTimeFormatOptions= { hour: '2-digit', minute: '2-digit'}
    return new Date(dateString).toLocaleString(undefined, options)
  }
const DailyLogs :React.FC<DailyLogsProps> = (props) => {
   
    return (
        <div>
            {props.checkIn  &&   <p>Check In Time : {formatDate(props.checkIn)} </p>}
            
            {props.breaks  && props.breaks.length>0 && (props.breaks.map((brk,index)=>(
                <div key={index}>
                    {brk.breakIn  && <p>BreakIn : {formatDate(brk.breakIn)}</p>}
                    {brk.breakOut && <p>BreakOut : {formatDate(brk.breakOut)}</p>}
                </div>
            )))
            }
            {props.checkOut &&  <p>Check Out Time : {formatDate(props.checkOut)}</p>}      
        </div>
      )
}

export default DailyLogs