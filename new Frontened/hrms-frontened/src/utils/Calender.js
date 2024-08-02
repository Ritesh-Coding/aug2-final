import React from 'react'
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
const Calender = () => {
    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
      ]);
    
    
      {}
      
  return (
    <>
    <p>{state[0]["startDate"]}</p>
    <p>{state[0]["endDate"]}</p>
    </>
    
  )
}

export default Calender