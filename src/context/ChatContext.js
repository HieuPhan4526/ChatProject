import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./Authcontext";
import { useReducer } from "react";

export const ChatContext = createContext();
export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);

    const INITAL_STATE = {
        chatId: "null",
        user: {}
    };
    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":


                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid
                };
            default:
                break;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITAL_STATE);



    return <ChatContext.Provider value={{ data: state, dispatch }}>
        {children}
    </ChatContext.Provider>;
};