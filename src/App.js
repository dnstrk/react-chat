import { useReducer } from "react";
import "./App.scss";
import JoinBlock from "./components/JoinBlock";
// import socket from "./socket";
import reducer from "./reducer";
import io from "socket.io-client";


const socket = io();
console.log(io())

function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
    });

    const onLogin = (obj) => {
        dispatch({ type: "JOINED", payload: obj });
        socket.emit("ROOM:JOIN", obj);
    };

    console.log(state);

    return <div>{!state.joined && <JoinBlock onLogin={onLogin} />}</div>;
}

export default App;
