import React, { useState } from "react";
import socket from "../../socket";
import cl from "./JoinBlock.module.scss";
import axios from "axios";

export default function JoinBlock({ onLogin }) {
    const [roomId, setRoomId] = useState("");
    const [userName, setUserName] = useState("");
    const [isLoading, setLoading] = useState(false);

    const onEnter = async () => {
        if (!roomId || !userName) {
            return alert("err");
        }
        const obj = {
            roomId,
            userName,
        };
        setLoading(true);
        try {
            // await axios.post("https://wkjnb4kz-9999.euw.devtunnels.ms/rooms",obj);
            await axios.post("http://localhost:9999/rooms", obj);
        } catch (error) {
            console.log(error);
        }
        onLogin(obj);
    };

    const handleEnter = (event) => {
        return event.key == "Enter" ? onEnter() : null;
    };

    return (
        <div className={cl.wrapper}>
            <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <input
                onKeyDown={handleEnter}
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button disabled={isLoading} onClick={onEnter}>
                {isLoading ? "Вход..." : "Войти"}
            </button>
        </div>
    );
}
