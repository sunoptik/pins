import { useState } from "react"
import { useEffect } from "react"
import Post from "./addPins"
import "./style.css"
import { Helmet, HelmetProvider } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import Masonry from "react-masonry-css";
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
    const breakpoint={
        default:3,
        1100:3,
        700:2,
        500:1
    }
    return(
        <div className="conteiner">
            <Masonry
            className="postconteiner"
            breakpointCols={breakpoint}>
             <HelmetProvider>
            <Helmet>
                <title>домашняя страница</title>
            </Helmet>
            </HelmetProvider>
            {document.map((d)=>{
                return  <NavLink key={d._id} to={`/post/${d._id}`} className="notextdecoration"><Post document={d}/></NavLink>
            })}
            </Masonry>
        </div>
    )
}