import { useEffect, useRef, useState } from "react"
import "./style.css"
import Post from "./addPins"
import { NavLink } from "react-router-dom"
import EditPosts from "./editpost"
import { Helmet, HelmetProvider } from "react-helmet-async";
import Masonry from "react-masonry-css"
export default function UserPosts(){
const [document,setdocument]=useState([])
const endpoint=useRef(null)
const loading=useRef(false)
const endposts=useRef(false)
const id=useRef(null)
async function fetchs() {
        if(loading.current===true){
            return
        }
        const res=await fetch("/userposts",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({id:id.current}),
            credentials:"include"
        })
        const data=await res.json()
        if(res.ok){
        id.current=data.document?.at(-1)?._id
        setdocument(data.documents)
        if(data.document.length!==24){
            endposts.current=true
        }
        loading.current=false
        }
        else{
            alert(data.message)
        }
    }
    useEffect(()=>{
        const listener=new IntersectionObserver(([entries])=>{
            if(entries.isIntersecting&&endposts.current===false){
                fetchs()
            }
        })
        listener.observe(endpoint.current)
        return()=>{listener.disconnect()}
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
            <div ref={endpoint}></div>
            </Masonry>
        </div>
    )
}