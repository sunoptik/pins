import { useRef, useState } from "react"
import { useEffect } from "react"
import Post from "./addPins"
import "./style.css"
import { Helmet, HelmetProvider } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import Masonry from "react-masonry-css";
export default function Posts(){
    const [document,setDocument]=useState([])
    const [endposts,setEndposts]=useState(false)
    const endpoint=useRef(null)
    const id=useRef(null)
    const loading=useRef(false)
    async function fetchs(){
        if(loading.current===true){
            return
        }
        loading.current=true
        const res=await fetch("/post",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({id:id.current})
        })
        const data=await res.json()
        setDocument((docx)=>[...docx,...data.document])
        id.current=data.document?.at(-1)?._id
        if(data.document.length!==24){
            setEndposts(true)
        }
        loading.current=false
    }
    useEffect(()=>{
        const listenner=new IntersectionObserver(([entries])=>{
            if(entries.isIntersecting&&!endposts){
                fetchs()
            }
        })
        listenner.observe(endpoint.current)
        return()=>{
            listenner.disconnect()
        }
    },[endposts])
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
            <div ref={endpoint}></div>
            </Masonry>
        </div>
    )
}