import { useEffect, useState } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom"
import"./style.css"
import { Toaster,toast } from "react-hot-toast";

export default function EditPosts(){
    const params=useParams()
    const [head,setHead]=useState("")
    const [description,setDescription]=useState("")
    const [document,setdocument]=useState([])
    const [open,setopen]=useState(false)
    const navigate=useNavigate()
    const [emptyHead,setEmptyHead]=useState(false)
    const [emptyDescription,setEmptyDescription]=useState(false)
    async function fetchs(){
        const res=await fetch(`/userposts/${params.id}`)
        const data=await res.json()
        setHead(data.head)
        setDescription(data.description)
        const docx=data.body.map((d)=>{
            if(d.type==="text"){
                return {...d}
            }
            else{
                return {...d,file:null}
            }
        })
        setdocument(docx)
    }
    useEffect(()=>{
        fetchs()
    },[params.id])
    function newtext(){
        setdocument([...document,{id:Date.now(),type:"text",value:""}])
    }
    function newimg(){
        setdocument([...document,{id:Date.now(),type:"img",cloudid:null,url:null,file:null,description:""}])
    }
    function changetext(e,id){
        setdocument(document.map((d)=>d.id===id?{...d,value:e}:d))
    }
    function changetextfile(e,id){
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setdocument(document.map((d)=>d.id===id?{...d,value:e.target.result}:d))
    };

    reader.onerror = (error) => {
      alert("Ошибка чтения файла: " + error.message);
    };

    reader.readAsText(file);
    }
    function load(e,id) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const reader = new FileReader()
    reader.onload = (event) => {
        setdocument(
            document.map((d) =>
                d.id === id ? { ...d, file: file, preview: event.target.result } : d
            )
        )
    }
    reader.readAsDataURL(file)
    e.target.value=""
    }
    function changeimgdescription(e,id){
    setdocument(document.map((d)=>d.id===id?{...d,description:e.target.value}:d))
    }
    async function del(){
        const res=await fetch(`/userposts/${params.id}`,{
            method:"DELETE",
        })
        const data=await res.json()
        if(res.ok){
            toast.success(data.message)
            setTimeout(()=>{navigate("/userposts")},3000)
        }
        else{
            toast.error(data.message)
        }
    }
    function deletepart(id){
        setdocument(docx=>docx.filter(d=>d.id!==id))
    }
    function returnoriginimg(id){
        setdocument(document.map(d=>d.id===id?{...d,file:null}:d))
    }
    async function submit(){
        if(!head||!description){
        if(!head){
            setEmptyHead(true)
        }
        if(!description){
            setEmptyDescription(true)
        }
        return toast.error("Обязательные поля не заполнены")
        }
        const formdata=new FormData()
        let nontext=false
        let nonimg=false
        const errormessage=[]
        const newdocument=document.map((d)=>{
            if(d.type==="img"){
                if(!d.file){
                nonimg=true
                }
                return {id:d.id,type:"img",cloudid:d.cloudid,description:d.description,url:d.url,change:d.file?true:false}
            }
            else{
                if(!d.value){
                nontext=true
                }
                return d
            }
        })
        if(nontext){
        errormessage[0]="Не все абзацы заполнены"
        }
        if(nonimg){
            errormessage[1]="Не все картинки выбраны"
        }
        if(errormessage[0]||errormessage[1]){
            return toast.error(errormessage[0]+"\n"+errormessage[1])
        }
        formdata.append("head",head)
        formdata.append("description",description)
        formdata.append("body",JSON.stringify(newdocument))
        document.forEach((d)=>{
            if(d.type==="img"&&d.file){
            formdata.append("img",d.file,`${d.id}.png`)}
        })
        const res=await fetch(`/userposts/${params.id}`,{
            method:"POST",
            body:formdata,
            credentials:"include"
        })
        const data=await res.json()
        if(res.ok){
             toast.success(data.message)
             setTimeout(() => {navigate("/useposts")},3000);
        }
        else{
            toast.error(data.message)
        }
    }
    return(
        <div className="addpostconteiner">
            <Toaster position="top-right" reverseOrder={false}></Toaster>
             <HelmetProvider>
            <Helmet>
                <title>{`редактирование|${head}`}</title>
            </Helmet>
            </HelmetProvider>
            <form id="metadata" className="formconteiner">
            <input id="head" className="input inputhead" type="text" placeholder="заголовок" value={head} onChange={(e)=>{setHead(e.target.value)}} required/> 
            <input id="description" className="input inputhead" type="text" placeholder="описание" value={description} onChange={(e)=>{setDescription(e.target.value)}} required/> 
            </form>
            {document.map((docx)=>{
                return docx.type==="text"?(
                <div className="textconteiner">
                <textarea className="textareainput" value={docx.value} onChange={(e)=>{changetext(e.target.value,docx.id)}}></textarea>
                <label htmlFor={`inputtext${docx.id}`} className="inputfilelabel">выбрать файл</label>
                <input id={`inputtext${docx.id}`} className="inputfile"type="file" onChange={(e)=>{changetextfile(e,docx.id)}} /> 
                <button className="cross-btn" onClick={()=>{deletepart(docx.id)}}><div className="cross-line1"></div><div className="cross-line2"></div></button> </div>
                ):(<div className="imgconteiner">
                <label htmlFor={`inputimg${docx.id}`} className="inputfilelabel">{docx.file?"изменить выбор":"выбрать картинку"}</label>
                {docx.file&&docx.url?(<button onClick={()=>{returnoriginimg(docx.id)}}>отменить изменене картинки</button>):""} 
                <input className="inputfile" type="file" id={`inputimg${docx.id}`}  onChange={(e)=>{load(e,docx.id)}} accept="image/*" />
                {(docx.file||docx.url)&&
                (<div className="imgconteiner">
                <img className="img" src={docx.file?docx.preview:docx.url} alt="" />
                <input className="input" type="text" value={docx.description} placeholder="подпись к картинке" onChange={(e)=>{changeimgdescription(e,docx.id)}}/> 
                <button className="cross-btn" onClick={()=>{deletepart(docx.id)}}><div className="cross-line1"></div><div className="cross-line2"></div></button> </div>)}</div>)}
            )}
            <div className={`buttonconteiner ${open ? "open" : ""}`}>   
            <button className="instrumentbutton" type="button" onClick={() => setopen(!open)}>
                <div className="plus-line1"></div>
                <div className="plus-line2"></div>
            </button>
            <button className="addbutton btn1" type="button" onClick={() => { newtext(); setopen(false); }}>T</button>
            <button className="addbutton btn2" type="button" onClick={() => { newimg(); setopen(false); }}>I</button>
            <button className="addbutton btn3" type="button" onClick={() => { submit(); setopen(false); }}>S</button>
            <button className="addbutton btn4" type="button" onClick={()=>{del()}}>D</button>
            </div>
            <br /><br />
            
        </div>
    )
}