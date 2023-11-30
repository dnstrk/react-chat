import React, { useEffect, useRef, useState } from "react";
import cl from "./Chat.module.scss";
import socket from "../../socket";
import axios from "axios";

export default function Chat({
    users,
    messages,
    userName,
    roomId,
    onAddMessage,
    dispatch,
}) {
    const [messageVal, setMessageVal] = useState("");
    const messageRef = useRef(null);
    const textareaRef = useRef();

    const handleTextareaSubmit = (event) => {
        if (event.key == "Enter") {
            return window.event.shiftKey
                ? (textareaRef.value = `\n`)
                : (onSendMessage(), event.preventDefault());
        }
    };

    const onSendMessage = (event) => {
        if (
            !!messageVal &&
            !messageVal.match(/^[ ]+$/) &&
            !messageVal.match(/^[\n]+$/)
        ) {
            socket.emit("ROOM:NEW_MESSAGE", {
                userName,
                roomId,
                text: messageVal,
            });
            onAddMessage({
                userName,
                text: messageVal,
            });
            setMessageVal("");
        } else return;

        
    };

    const onClearChat = async () => {
        socket.emit("ROOM:CLEAR_CHAT", { roomId });
        const { data } = await axios.get(
            // `https://wkjnb4kz-9999.euw.devtunnels.ms/rooms/${roomId}`
            `http://localhost:9999/rooms/${roomId}`
        );
        dispatch({ type: "SET_DATA", payload: data });
    };

    useEffect(() => {
        messageRef.current.scrollTo(0, 999999);
    }, [messages]);

    return (
        <div className={cl.container}>
            <div className={cl.chat}>
                <div className={cl.chatUsers}>
                    <b>Комната: {roomId}</b>
                    <b>Онлайн: ({users.length})</b>
                    <ul>
                        {users.map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                </div>
                <div className={cl.chatMessages}>
                    <div ref={messageRef} className={cl.messages}>
                        {messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div key={index} className={cl.message}>
                                    <p>{message.text}</p>
                                    <span>{message.userName}</span>
                                </div>
                            ))
                        ) : (
                            <div className={cl.message}>
                                <p>No messages</p>
                            </div>
                        )}
                    </div>
                    <form>
                        <textarea
                            ref={textareaRef}
                            onKeyDown={handleTextareaSubmit}
                            value={messageVal}
                            onChange={(e) => setMessageVal(e.target.value)}
                            rows="3"
                            autoFocus
                        ></textarea>
                        <button
                            type="button"
                            onClick={onSendMessage}
                            className={cl.btn}
                        >
                            Отправить
                        </button>
                        <button
                            type="button"
                            onClick={onClearChat}
                            className={`${cl.btn} ${cl.btnClear}`}
                        >
                            Очистить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
