import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "./style.css"

export default function SeePost(){
    const params=useParams()
    const [body,setBody]=useState([])
    const [head,setHead]=useState("")
    const [description,setDescription]=useState("")
    useEffect(()=>{
        async function fetchs() {
            const res=await fetch(`/post/${params.id}`)
            const data= await res.json()
            setBody(data.body)
            setHead(data.head)
            setDescription(data.description)
        }
        fetchs()
    },[params.id])
    return(
        <div className="seepostconteiner">
            <span>{head}</span>
            <span>{description}</span>
            {body.map((b)=>{
                return b.type==="text"?(
                <div className="textconteiner"><p>{b.value}</p></div>):(
                <div className="imgconteiner"> <img src={b.url} alt="img" />
                <span className="spandescription">{b.description}</span></div>)
                }
            )}
        </div>
    )
}