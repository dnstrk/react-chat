import React from "react";
import socket from "../socket";

export default function JoinBlock() {
    return (
        <>
            <input type="text" placeholder="Room ID" />
            <input type="text" placeholder="Username" />
            <button>Join</button>
        </>
    );
}
