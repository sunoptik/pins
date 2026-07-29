import { useEffect, useState } from "react"
import "./style.css"
import { Helmet,HelmetProvider} from "react-helmet-async"
import toast, { Toaster } from "react-hot-toast"
export default function EditPassword(){
    const [password,setPassword]=useState("")
    const [copypassword,setCopyPassword]=useState("")
    const disable=password===""||copypassword===""
    async function submit(){
        if(password!==copypassword){
        return  toast.error("пароли не совпадают")
        }
        const valid=/^(?=.*?\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/
        if(!valid.test(password)){
            toast("Пароль должен содержать минимум 8 символов: хотя бы одну цифру, заглавную букву, строчную букву и спецсимвол",{duration:6000})
            return
        }
        const res=await fetch("/profile/edit/password",{
            method:"POST",
           headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password:password }),
            credentials:"include"
        })
        const data=await res.json()
        if (res.ok){
            toast.success(data.message)
            setTimeout(()=>{window.close()},4000)
        }
        else{
            toast.error(data.message)
        }

    }
    return(
         <div className="login">
            <Toaster position="top-right" reverseOrder={false}></Toaster>
            <HelmetProvider>
            <Helmet>
                <title>изменение пароля</title>
            </Helmet>
            </HelmetProvider>
            <input className="input inputlogin" type="text" value={password} placeholder="введите новый пароль" onChange={(e)=>{setPassword(e.target.value)}} />
            <input className="input inputlogin" type="password"  value={copypassword} placeholder="повторите пароль" onChange={(e)=>{setCopyPassword(e.target.value)}} />
            <div><button disabled={disable} onClick={()=>{submit()}} >изменить пароль</button></div>
        </div>
    )
}