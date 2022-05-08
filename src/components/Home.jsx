import React, { useEffect, useState } from "react";
import axios from 'axios'
import Chat from "./Chat";
import './../index.css';
import {useLocation} from "react-router-dom";
import logo from "./../assets/TFH.svg";

const Home = (props) => {

    const search = useLocation().search;
    const email = new URLSearchParams(search).get('email');
    const name = new URLSearchParams(search).get('name');
    const token = new URLSearchParams(search).get('token');
   
    const [room, setRoom] = useState();
    const [currentRoom, setcurrentRoom] = useState('Select a room to chat');
    const [rooms, setrooms] = useState([])
    const [modal, setModal] = useState(0);
    const [newMember, setNewMember] = useState("");
  
    const addNewMember = (e)=>{
      e.preventDefault();
      if(newMember){
        console.log(newMember, room)
        axios.post('https://wecollab-team.herokuapp.com/teams/room/addmember', { roomName: currentRoom, email : newMember })
        .then((data) => {
          setNewMember("")
          alert(data.data.msg)
        })
      }else{
        alert('Add a valid email')
      }
    }
  useEffect(() => {
    axios.post('https://wecollab-team.herokuapp.com/teams/getrooms', { email: email })
      .then((data) => {
        setrooms(data.data.rooms)
      })
  }, [])
  const closeModal = () =>{
    setModal(0)
  }
  const openModal = () => {
    setModal(1)
  }
  const createRoom = (e) => {
    e.preventDefault()
    axios.post('https://wecollab-team.herokuapp.com/teams/createroom', { room: room, email: email, name : name })
    .then((res) => {
      setrooms(res.data.rooms)
      closeModal()
      setcurrentRoom(room)
    })
  }

  const setcRoom = async (val) => {
    setcurrentRoom(val)
  }


  return (
    <div class="background">
      <div class="top">
        <img src={logo} alt="" class="logo"/>
        <h2 class="heading">WeCollab Team Groups</h2>
      </div>
      <div class="header">
        <div class="left-header"><span>Team Chats</span> <div id="newTeam" onClick={openModal}>+</div></div>
        <div class="right-header">
          <div class="roomname">
            {currentRoom}
          </div>
          <div class="add-person">
            <form onSubmit = {addNewMember}>
              <input type="text" placeholder ="Add new member" value={newMember} onChange = {(e) => setNewMember(e.target.value)}></input>
              <button type="submit">
                <i class="fa fa-user-plus"></i>
              </button>
            </form>
          </div>
          </div>
      </div>
      <div class="main-box">
        <div class="user-lists">
          {
            rooms.map((val, idx) => {
              return (
                <>
                {
                  (currentRoom == val)?
                  <div class="user-modal">
                    <button class="user-button" key={idx} onClick={(e) => setcRoom(val.roomName)}>{val.roomName}</button>
                  </div>
                    :
                  <div class="user-modal">
                    <button class="user-button" key={idx} onClick={(e) => setcRoom(val.roomName)}>{val.roomName}</button>
                  </div>
                }
              </>)
            })
          }
        </div>
        <div class="conversation-box">
          {
            currentRoom !== 'Select a room to chat' ? <Chat room={currentRoom} name={name} /> : <div class="empty-box">
              Kindly select a team conversation to view messages :)
            </div>
          }
        </div>        
      </div>
      { 
      (modal == 1)? 
        <div className="team-modal">
          <div className="new-room">
            <form onSubmit={createRoom}>
                <input
                  placeholder="Enter room name..."
                  type="text"
                  onChange={(event) => setRoom(event.target.value)}
                  required
                />
              <button type="submit" > Create new room </button>
            </form>
            <div className="cross-button" onClick={closeModal} >
              Close
            </div>
          </div>
        </div>
      : <></>
      }
    </div>
  );
};



export default Home