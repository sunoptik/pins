import React from "react";
import ReactDom, { createRoot } from "react-dom/client";
import Header from "./header";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import AddPins from "./addPins";
import Login from "./login";
import AddText from "./addText";
import UserPosts from "./userposts";
import EditPosts from "./editpost";
import Home from "./home";
import Profile from "./profile";
import EditPassword from "./editPassword";
import SeePost from "./SeePost";
import Category from "./Category";
const reactroote=document.getElementById("root");
const root=ReactDom.createRoot(reactroote);
root.render(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/post/:id" element={<SeePost />}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/profile/edit/password" element={<EditPassword />}/>
    <Route path="/category" element={<Category />}></Route>
    <Route path="/addpost" element={<AddText/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/userposts" element={<UserPosts />} />
    <Route path="/userposts/:id" element={<EditPosts />} />
    </Routes>
    </BrowserRouter>
)