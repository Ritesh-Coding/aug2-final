import React, { useEffect, useState } from 'react'
import useAxios from '../../../hooks/useAxios';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
const Chat = () => {
    const [messages,setMessages]=useState([]);
    const [message,setMessage]= useState('')
    // const [employeeId,setEmployeeId]=useState(1)
    const chatSocket = useRef(null);
    const axiosInstance = useAxios()
    const { userId,firstName} = useSelector(state => state.auth);
    let employeeId = userId
    useEffect(()=>{
        axiosInstance.get('http://127.0.0.1:8000/chat/')
        .then(response => {
            setMessages(response.data);
        });
    },[])

    useEffect(()=>{

        //connecting to the webSocket
        chatSocket.current = new WebSocket(
            'ws://127.0.0.1:8000/ws/chat/'
        );
        chatSocket.current.onmessage = function(e) {
            const data = JSON.parse(e.data);
            setMessages(prevMessages => [...prevMessages, data]);
        };
        chatSocket.current.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    },[employeeId])

    const handleSendMessage = () => {
        chatSocket.current.send(JSON.stringify({
            'message': message,
            'employee_id': employeeId,
            'first_name':firstName
        }));
        setMessage('');
    };
  return (
    <div>
    <textarea width="150px" readOnly value={messages.map(msg => `${msg.first_name}:: ${msg.message}`).join('\n')} cols="110" rows="20" />
    <br />
    <div style={{display:`flex`}}>

    <div>
    <input
        type="text"
        id="inputText"     
        placeholder='Enter your text here ...'
        size="105"
        value={message}
        onChange={e => setMessage(e.target.value)}       
        onKeyUp={e => { if (e.key === 'Enter') handleSendMessage(); }}
    />

    <button onClick={handleSendMessage} className="btn btn-success">Send</button>


   

    
    </div>

    </div>
    
  
  
</div>
  )
}

export default Chat