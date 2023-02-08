import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import { AuthContext } from "../context/Authcontext.js";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext.js";
import { v4 as uuid } from "uuid";
import { useRef } from "react";

export default function Home() {
  const { currentUser } = useContext(AuthContext);

  const { dispatch, data } = useContext(ChatContext);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const ref = useRef();
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChatrs", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, messages);
  const handleSend = async () => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userChatrs", currentUser.uid), {
      [data.chatId + ".lastMessager"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChatrs", data.user.uid), {
      [data.chatId + ".lastMessager"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await setText("");
  };

  const handledispatch = (u) => {
    dispatch({
      type: "CHANGE_USER",
      payload: u,
    });
  };
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", userName)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setError(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    // Check whether the group (chats in firestore) exists, if not create
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedID));
      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedID), { messages: [] });
        // create user chats
        await updateDoc(doc(db, "userChatrs", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChatrs", user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {}
    // create user chats
    setUser(null);
    setUserName("");
  };

  return (
    <div className="background-home">
      <div className="homeContent">
        <div className="listFriend">
          <div className="nav-list">
            <span className="nav-logo">Test Chat</span>
            <div className="nav-content">
              <span className="text-light">{currentUser.displayName}</span>
              <button
                onClick={() => {
                  signOut(auth);
                }}
                className="btn btn-info"
              >
                logout
              </button>
            </div>
          </div>
          <input
            className="inputSearch"
            type="text"
            placeholder="Find user..."
            onKeyDown={handleKey}
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          {error && <span>User Not Found!</span>}
          {user && (
            <div className="user" onClick={handleSelect}>
              <i className="fa fa-user"></i>
              <div className="user-info">
                <h5>{user.displayName}</h5>
              </div>
            </div>
          )}
          <hr />
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat, index) => {
              return (
                <div
                  key={index}
                  className="user"
                  onClick={() => handledispatch(chat[1].userInfo)}
                >
                  <i className="fa fa-user"></i>
                  <div className="user-info">
                    <h5>{chat[1].userInfo.displayName}</h5>
                    <span>{chat[1].lastMessager?.text}</span>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="messengers">
          <div className="nav-mess">
            <span>{data.user?.displayName}</span>
            <div className="nav-icon">
              <i className="fa fa-video" />
              <i className="fa fa-user-plus" />
              <i className="fa fa-bars" />
            </div>
          </div>
          <div className="messs-content">
            {messages.map((mess, index) => {
              return (
                <div
                  key={index}
                  ref={ref}
                  className={`myMess ${
                    mess.senderId === currentUser.uid && "owner"
                  }`}
                >
                  <div className="text-center">
                    <i className="fa fa-user"></i>
                    <p>just now</p>
                  </div>
                  <div className="Mymess-content">
                    <span>{mess.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="footer-messs">
            <input
              type="text"
              placeholder="Type something...."
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <div className="icon-footer">
              <i className="fa fa-paperclip" />
              <i className="fa fa-file-image" />
              <button onClick={handleSend} className="btn btn-primary">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
