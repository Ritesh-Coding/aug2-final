import { useState,useEffect } from "react";
export const useWebSocket = (adminId,userId) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (userId) {
            const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chatting/${adminId}/${userId}/`);
            setWs(socket);
     
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log(data,"dsfdfggfhgf");
                setMessages((prev) => [...prev, data]);
            };

            socket.onclose = () => {
                console.error('WebSocket closed unexpectedly');
            };

            return () => socket.close();
        }
    }, [userId]);

    const sendMessage = (message) => {
        if (ws) {
            ws.send(JSON.stringify(message));
        }
    };

    return { sendMessage, messages };
};