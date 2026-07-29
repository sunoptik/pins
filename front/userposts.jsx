import { useEffect, useState } from "react"
import "./style.css"
import Post from "./addPins"
import { NavLink } from "react-router-dom"
import EditPosts from "./editpost"
import { Helmet, HelmetProvider } from "react-helmet-async";
export default function UserPosts(){
const [document,setdocument]=useState([])
async function fetchs() {
        const res=await fetch("/userposts",{
            method:"GET",
            credentials:"include"
        })
        const data=await res.json()
        setdocument(data.documents)
    }
    useEffect(()=>{
        fetchs()
    },[])
    return(
        <div className="conteiner">
             <HelmetProvider>
            <Helmet>
                <title>ваши посты</title>
            </Helmet>
            </HelmetProvider>
            <div className="postconteiner">
                {document.map((d)=>{
                    return <div><NavLink to={`/userposts/${d._id}`} key={d._id} ><Post key={d._id} document={d}/></NavLink></div>
                })}
            </div>
        </div>
    )
}