import  React, { useState , useEffect } from 'react'

export const DateTime: React.FC = () => {

    const [date,setDate] = useState<Date>(new Date());
    
    useEffect(() => {
        let timer = setInterval(()=>setDate(new Date()), 1000 )
        return function cleanup() {
            clearInterval(timer)
        }   
    });

    return(
        <div>
            <p>{date.toLocaleTimeString()}</p>   

        </div>
    )
}

export default DateTime