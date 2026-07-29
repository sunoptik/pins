import "./style.css"
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
export default function Profile(){
    const [count,setCount]=useState(0)
    const [user,setUser]=useState({})
    const [foto,setFoto]=useState({file:null,url:null})
    const [day,setDay]=useState(0)
    const [month,setMonth]=useState(0)
    const [year,setYear]=useState(0)
    useEffect(()=>{
        async function query() {
            const res=await fetch("/profile",{
                method:"GET",
                credentials:"include"
            })
            const data=await res.json()
            setCount(data.count)
            setUser(data.user)
            const postDate = new Date(data.user.createdAt);
            setDay(postDate.getDate())
            setMonth(postDate.getMonth())
            setYear(postDate.getFullYear())
        }
        query()
    },[])
    function load(e){
        const file=e.target.files
        if(!file[0]||file.length===0){
            return
        }
        setFoto({file:file[0],url:URL.createObjectURL(file[0])})
        e.target.value=""
    }
    async function submit(){
        const formdata=new FormData()
        formdata.append("avatar",foto.file)
        const res=await fetch("/profile/edit/avatar",{
            method:"POST",
            body:formdata,
            credentials:"include"
        })
        const data=await res.json()
        if(res.ok){
            toast.success("аватарка изменена")
            setUser(u=>({...u,imgUrl:data.url}))
        }
        else{
            toast.error(data.error)
        }
        if (foto.url) URL.revokeObjectURL(foto.url);
         setFoto({ file: null, url: null });
    }
    function open(e){
        e.preventDefault()
        window.open("/profile/edit/password","_blank","popup=yes");
    }
    return (
        <div className="profile">
             <HelmetProvider>
            <Helmet>
                <title>профиль</title>
            </Helmet>
            </HelmetProvider>
            <Toaster position="top-right" reverseOrder={false}/>
            <div className="column"><div className="column1"><div>
            <h2>логин</h2>
            <p>{user.login}</p></div>
            <div><h2>дата создания профиля</h2>
            <p>{(day<9?("0"+day):day)+":"+(month<8?"0"+(month+1):(month+1))+":"+year}</p></div>
            <div><h2>количество постов</h2>
            <p>{count}</p></div>
            <button><NavLink to="/profile/edit/password" onClick={(e)=>{open(e)}}>сменить пароль</NavLink></button>
            </div>
            <div className="column2">
            <img src={user.imgUrl?(foto.file?foto.url:user.imgUrl):(foto.file?foto.url:"/avatar.jpg")} alt="user_avatar" />
            <label htmlFor="inputfile" className="inputfilelable">выбрать файл</label>
            <input type="file" className="inputfile" id="inputfile" onChange={(e)=>{load(e)}}/>
            {foto.file?(<button onClick={()=>{submit()}}>отправить</button>):""}</div></div>
        </div>
    )
}   