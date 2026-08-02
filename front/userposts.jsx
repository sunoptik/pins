import { useEffect, useState } from "react"
import "./style.css"
import Post from "./addPins"
import { NavLink } from "react-router-dom"
import EditPosts from "./editpost"
import { Helmet, HelmetProvider } from "react-helmet-async";
import Masonry from "react-masonry-css"
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
                    <title>ваши посты</title>
                </Helmet>
            </HelmetProvider>
            {document.map((d)=>{
                return  <NavLink key={d._id} to={`/userposts/${d._id}`} className="notextdecoration"><Post document={d}/></NavLink>
            })}
            </Masonry>
        </div>
    )
}