import { useEffect, useReducer } from "react";
import "./App.scss";
import JoinBlock from "./components/JoinBlock";
import socket from "./socket";
import reducer from "./reducer";
import Chat from "./components/Chat";
import axios from "axios";

function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: [],
    });

    const onLogin = async (obj) => {
        dispatch({ type: "JOINED", payload: obj });
        socket.emit("ROOM:JOIN", obj);
        const { data } = await axios.get(
            `https://wkjnb4kz-9999.euw.devtunnels.ms/rooms/${obj.roomId}`
            // `http://localhost:9999/rooms/${obj.roomId}`
        );
        dispatch({ type: "SET_DATA", payload: data });
    };

    const setUsers = (users) => {
        dispatch({ type: "SET_USERS", payload: users });
    };

    const addMessage = (message) => {
        dispatch({
            type: "NEW_MESSAGE",
            payload: message,
        });
    };

    useEffect(() => {
        socket.on("ROOM:SET_USERS", setUsers);
        socket.on("ROOM:NEW_MESSAGE", (message) => {
            addMessage(message);
        });
    }, []);

    return (
        <div className="App">
            {!state.joined ? (
                <JoinBlock onLogin={onLogin} />
            ) : (
                <Chat
                    {...state}
                    onAddMessage={addMessage}
                    dispatch={dispatch}
                />
            )}
            {/* <Chat
                    {...state}
                    onAddMessage={addMessage}
                    dispatch={dispatch}
                /> */}
        </div>
    );
}

export default App;
