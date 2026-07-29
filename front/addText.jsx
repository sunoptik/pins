import { useRef } from "react";
import { useState } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./style.css"
export default function AddText(){
    const [document,setdocument]=useState([{id:Date.now(),type:"text",value:""}]);
    const [text,setText]=useState("")
    const [head,setHead]=useState("")
    const [description,setDescription]=useState("")
    const docxref=useRef(null)
    const [open,setopen]=useState(false)
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
    setdocument(document.map((d)=>d.id===id?{
        ...d,file:file}:d))
  }
  function changeimgdescription(e,id){
    setdocument(document.map((d)=>d.id===id?{...d,description:e.target.value}:d))
  }
  /*async function build(){
    const { ImageRun, Paragraph, TextRun,Document, Packer }= await import("docx");
    const { renderAsync }= await import( "docx-preview");
    const childrenelem=[]
    for(const docx of document){
        if(docx.type==="text"&&docx.value.trim()!==""){
            childrenelem.push(
            new Paragraph({
                children:[new TextRun({text:docx.value,size:24})],
                spacing:{after:200}
            })
        )
        }
        else if(docx.type==="img"&&docx.value){
            childrenelem.push(
                new Paragraph({
                    children:[new ImageRun({data:docx.value,transformation:{width:400,height:400}})],
                    spacing:{after:200}
                })
            )
        }
    }
    const doc=new Document({
        sections:[{children:childrenelem}]
    })
    const blob=await Packer.toBlob(doc)
    if(docxref.current){
        docxref.current.innerHTML=""
        await renderAsync(blob,docxref.current,null,{inWrapper:true})
    }

  }*/
  async function submit() {
    const formdata=new FormData()
    const textdocument=document.map((d)=>{
        if(d.type==="img"){
            return{id:d.id,type:d.type,cloudid:null,url:null,description:d.description}
        }
        else{
            return d
        }
    })
    formdata.append("head",head)
    formdata.append("description",description)
    formdata.append("text",JSON.stringify(textdocument))
    document.forEach((d)=>{
        if(d.type==="img"&&d.file){
        formdata.append("img",d.file,`${d.id}.png`)}
    })
    const data=await fetch("/addpost",{
        method:"POST",
        body:formdata,
        credentials:"include"
    })
    if(data.ok){
        alert("успешно")
    }
  }
    function deletepart(id){
        setdocument(docx=>docx.filter(d=>d.id!==id))
    }
    return(
        <div className="addpostconteiner">
            <form id="metadata" className="formconteiner">
            <input id="head" className="input inputhead" type="text" placeholder="заголовок" value={head} onChange={(e)=>{setHead(e.target.value)}} required/> 
            <input id="description" className="input inputhead" type="text" placeholder="описание" value={description} onChange={(e)=>{setDescription(e.target.value)}} required/> 
            </form>
            {document.map((docx)=>{
                return docx.type==="text"?(
                <div className="textconteiner" key={docx.id}>
                <textarea className="textareainput" value={docx.value} onChange={(e)=>{changetext(e.target.value,docx.id)}}></textarea>
                <label htmlFor={`inputtext${docx.id}`} className="inputfilelabel">выбрать файл</label>
                <input id={`inputtext${docx.id}`} className="inputfile"type="file" onChange={(e)=>{changetextfile(e,docx.id)}} /> 
                <button className="cross-btn" onClick={()=>{deletepart(docx.id)}}><div className="cross-line1"></div><div className="cross-line2"></div></button> </div>
                ):(<div className="imgconteiner" key={docx.id}>
                <label htmlFor={`inputimg${docx.id}`} className="inputfilelabel">{docx.file?"изменить выбор":"выбрать картинку"}</label>
                <input className="inputfile" type="file" id={`inputimg${docx.id}`}  onChange={(e)=>{load(e,docx.id)}} accept="image/*" />
                {docx.file?(<div className="imgconteiner"><img className="img" src={URL.createObjectURL(docx.file)} alt="" /> 
                <input className="input" type="text" value={docx.description} placeholder="подпись к картинке" onChange={(e)=>{changeimgdescription(e,docx.id)}}/> 
                <button className="cross-btn" onClick={()=>{deletepart(docx.id)}}><div className="cross-line1"></div><div className="cross-line2"></div></button> </div>):""}</div>)
            }
            )}
            <div className={`buttonconteiner ${open ? "open" : ""}`}>   
            <button className="instrumentbutton" type="button" onClick={() => setopen(!open)}>
                <div className="plus-line1"></div>
                <div className="plus-line2"></div>
            </button>
            <button className="addbutton btn1" type="button" onClick={() => { newtext(); setopen(false); }}>T</button>
            <button className="addbutton btn2" type="button" onClick={() => { newimg(); setopen(false); }}><svg></svg></button>
            <button className="addbutton btn3" type="button" onClick={() => { submit(); setopen(false); }}>✓</button>
            </div>
            
            <div>
                 <HelmetProvider>
                <Helmet>
                    <title>создание поста</title>
                </Helmet>
                </HelmetProvider>
                {/*document.map((docx)=>{
                    if(docx.type==="text"){
                        return<p>{docx.value}</p>
                    }
                    else if(docx.type==="img"&& docx.file){
                        const url =URL.createObjectURL(docx.file);
                        return<img src={url} alt="" />
                    }
                    return null
                })*/}
            </div>
        </div>
    )
}