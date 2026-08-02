import { useState } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";

export default  function Login(){
    const [login,setlogin]=useState("")
    const [password,setpassword]=useState("")
    const [seepass,setSeepass]=useState(false)
    async function submit(useraction){
        const valid=/^(?=.*?\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/
        if(login.trim()===""){
            toast.error("Введите логин")
            return
        }
        if(!valid.test(password)){
            toast.error("Пароль должен содержать минимум 8 символов: хотя бы одну цифру, заглавную букву, строчную букву и спецсимвол")
            return
        }
        if(useraction==="old"){
        const user={login:login,password:password,role:"user"}
        const new_user=await fetch("/login",
        {method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(user),
        credentials:"include"
        });
        const data=await new_user.json()
        if(new_user.ok){
            window.opener.postMessage({
                sucses:true,
                user:data.login
            },"*")
            window.close()
        }
        else{
            toast.error(data.message)
        }
        }
        else if(useraction==="new"){
        const user={login:login,password:password,role:"user"}
        const new_user=await fetch("/reg",
        {method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(user)});
        const data=await new_user.json()
        if(new_user.ok)
        {toast.success(data.message)}
        else if(new_user.status===400){
            toast.error(data.message)
        }
        }}
    return (
        <div className="login">
            <HelmetProvider>
            <Helmet>
                <title>вход/регистрация</title>
            </Helmet>
            </HelmetProvider>
            <Toaster reverseOrder={false} position="top-right">
            </Toaster>
            <input className="input inputlogin" type="text" id="login" value={login} placeholder="input login" onChange={(e)=>{setlogin(e.target.value)}} />
            <input className="input inputlogin" type={seepass?"text":"password"} id="password" value={password} placeholder="input password" onChange={(e)=>{setpassword(e.target.value)}} />
            <div><input type="checkbox" onChange={()=>{setSeepass(!seepass)}} id="seepass"/> <label htmlFor="seepass">показать пароль</label></div>
            <div><button type="button" onClick={()=>(submit("old"))}>войти</button>
            <span>/</span>
            <button type="button" onClick={()=>(submit("new"))}>зарегистрироваться</button></div>
        </div>
    )
}