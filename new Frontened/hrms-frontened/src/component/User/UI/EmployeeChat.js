import { useState,useEffect } from "react";
import { useWebSocket } from "../../../hooks/useWebSocket";

const EmployeeChat = ({ adminId ,userId}) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { sendMessage, messages: wsMessages } = useWebSocket(adminId,userId);

    useEffect(() => {
        setMessages(wsMessages);
    }, [wsMessages]);

    const handleSendMessage = () => {
        sendMessage({ message, recipient_id: adminId });
        setMessage('');
    };

    return (
        <div>
            <h2>Chat with Admin</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};
export default EmployeeChat;
