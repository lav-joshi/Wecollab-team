import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import axios from 'axios'
import './../index.css';

let socket;

const Chat = (props) => {

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");


  const ENDPOINT = "https://wecollab-team.herokuapp.com";

  useEffect(() => {

    if (room.length) {
      socket.disconnect()
    }
    socket = io(ENDPOINT);

    if(room.length){
      socket.emit('disconnector',{name : name, room : room})
    }

    socket.emit("join", { name: props.name, room: props.room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    setRoom(props.room);
    setName(props.name);
    setMessages([]);

  }, [props]);

  useEffect(() => {
    axios.post('https://wecollab-team.herokuapp.com/teams/room/data', { roomName: props.room })
      .then((data) => {
        setMessages(data.data.roomData.messages)
      })
  }, [props])

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, {senderName : message.senderName, message : message.message}]);
    });
  }, [props]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message });
      setMessage("");
    } else alert("empty input");
  };



  return (
    <>
      
      <div className="conv-wrapper">
        <div className="conversations">
          {
            messages.map((val, i) => {
              return (
                <>
                {
                  (val.senderName == name)?
                    <div class="message-box user" key={i} >
                      <span class="sender-name user">You</span>
                      <span class="message user">{val.message}</span>
                    </div>
                    :
                    <div className="message-box other-user">
                      <span class="sender-name other-user">{val.senderName}</span>
                      <span class="message other-user">{val.message}</span>
                    </div>
                }
                </>
              );
            })
          }
        </div>
      </div>
      <form className="message-input" action="" onSubmit={handleSubmit}>
        <input
          class="form-control"
          type="text"
          value={message}
          placeholder="Write Message... "
          onChange={(e) => setMessage(e.target.value)}
        />
        <button id="send-button" type="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
      </form>
    </>
  );
};

export default Chat
