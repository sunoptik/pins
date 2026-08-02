import React, { useState } from "react";
import { BrowserRouter, NavLink, } from "react-router-dom";
import "./style.css"
import { useEffect } from "react";

export default function Header(){
    const [user, setUser] = useState("");
    const [search,setsearch]=useState("");
    const [login,setlogin]=useState(false);
    const [openmenu,setOpenmenu]=useState(false)
    /*async function check(){
        const res=await fetch("/home",{
            method:"GET",
            credentials:"include"
        })
        const log=await res.json()
        if (log) {
                setlogin(log.log);
                setUser(log.user);
            } else {
                setUser(null);
            }
    }*/
   function addevent(){
    window.addEventListener("message",(e)=>{
            if(e.data.sucses){
                localStorage.setItem("user",e.data.user)
                localStorage.setItem("log",e.data.sucses)
                setlogin(localStorage.getItem("log"))
                setUser(localStorage.getItem("user"))
                
            }
        })
   }
    useEffect(()=>{
        addevent()
        setlogin(localStorage.getItem("log"))
        setUser(localStorage.getItem("user"))
        return()=>{
            window.removeEventListener("message",addevent)
        }
    },[])
    function open(e){
        e.preventDefault();
        window.open("/login","_blank","popup=yes");
    }
    return(
        /*<div className="header">
            <ul>
            <li>
            <input type="text" value={search} onChange={(e)=>{setsearch(e.target.value)}}/>
            </li>
            <li>
            <button>search</button>
            </li>
            <li>
                {login?<NavLink to="/userposts">мои посты</NavLink>:""}
            </li>
            <li>
                {login?<NavLink to="/addpost"><div className="addcircule"><div className="partplus1"><div className="partplus2"></div></div></div></NavLink>:""}
            </li>
            <li>
                {login?<NavLink onClick={(e)=>{e.preventDefault();setlogin(false)}}>exit</NavLink>:<NavLink to="/login"onClick={open}>login</NavLink>}
            </li>
            </ul>
        </div>*/
        <div className="header">
            {login?<button className="username" onClick={()=>{setOpenmenu(!openmenu)}}>{user}</button>:<NavLink className="username" to="/login"onClick={open}>войти</NavLink>}
            {openmenu?(<div className="usermenu">
            <ul>
            <li>
                <NavLink className="notextdecoration" to="/category">категории</NavLink>
            </li>
            <li>
                <NavLink className="notextdecoration" to="/userposts">мои посты</NavLink>
            </li>
            <li>
                <NavLink className="notextdecoration" to="/addpost">добавить пост</NavLink>
            </li>
            <li>
                <NavLink className="notextdecoration" to={"/profile"}>профиль</NavLink>
            </li>
            <li>
                <NavLink className="notextdecoration" onClick={(e)=>{e.preventDefault();setOpenmenu(!openmenu); setlogin(false)}}>exit</NavLink>
            </li> 
            </ul>
            </div>):null}
        </div>
    )
}