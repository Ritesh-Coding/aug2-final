import React, { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

const AdminChat = ({ employees }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { sendMessage, messages: wsMessages } = useWebSocket(selectedEmployee?.id);

    useEffect(() => {
        setMessages(wsMessages);
    }, [wsMessages]);

    const handleSendMessage = () => {
        if (selectedEmployee) {
            sendMessage({ message, recipient_id: selectedEmployee.id });
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <div>
                <h3>Employees</h3>
                <ul>
                    {employees.map(emp => (
                                                <li key={emp.id} onClick={() => setSelectedEmployee(emp)}>
                            {emp.username}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedEmployee && (
                <div>
                    <h3>Chat with {selectedEmployee.username}</h3>
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
            )}
        </div>
    );
};

export default AdminChat;