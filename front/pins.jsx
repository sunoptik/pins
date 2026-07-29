import { useState } from "react"
import { useEffect } from "react"
import Post from "./addPins"
import "./style.css"
import { Helmet, HelmetProvider } from "react-helmet-async";
import { NavLink } from "react-router-dom";
export default function Posts(){
    const [document,setDocument]=useState([])
    async function fetchs(){
        const res=await fetch("/post")
        const data=await res.json()
        setDocument(data.document)
    }
    useEffect(()=>{
        fetchs()
    },[])
    return(
        <div className="conteiner">
             <HelmetProvider>
            <Helmet>
                <title>домашняя страница</title>
            </Helmet>
            </HelmetProvider>
            <div className="postconteiner">
            {document.map((d)=>{
                return  <NavLink to={`/post/${d._id}`}><Post key={d._id} document={d}/></NavLink>
            })}
            </div>
        </div>
    )
}