import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "./style.css"
import { Helmet, HelmetProvider } from "react-helmet-async"

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
        <div className="conteiner">
            <HelmetProvider>
                <Helmet><title>{head}</title></Helmet>
            </HelmetProvider>
        <div className="seepostconteiner">
            <span className="spanhead">{head}</span>
            <span className="spandescription">{description}</span>
            {body.map((b)=>{
                return b.type==="text"?(
                <div className="textconteiner"><p>{b.value}</p></div>):(
                <div className="imgconteiner"> <img src={b.url} alt="img" />
                <span className="spanimgdescription">{b.description}</span></div>)
                }
            )}
        </div>
        </div>
    )
}