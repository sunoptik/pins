const express=require('express');
const mongoose=require('mongoose');
const users = require("./models/users");
const path=require("path")
const crypto=require("crypto")
const jwt=require("jsonwebtoken")
const cookie=require("cookie-parser");
const posts = require("./models/posts");
const cloudinary=require("cloudinary").v2
const {CloudinaryStorage}=require("multer-storage-cloudinary")
const multer=require("multer");

cloudinary.config({
cloud_name: "qs6hbsol",
api_key: "569945485464984",
api_secret: '2pQ5sTdGL_ctthBs964PU4DX4-4'
})
const storage = new CloudinaryStorage({
 cloudinary: cloudinary,
 params: {
 folder: 'pic_posts',
 allowed_formats: ['png', 'jpg', 'jpeg'],
 transformation:{
    width: 800,
    height: 600,
    quality: "auto",     
    fetch_format: "auto"
 }
  }
});
const storageavatar = new CloudinaryStorage({
 cloudinary: cloudinary,
 params: {
 folder: 'pic_avatars',
 allowed_formats: ['png', 'jpg', 'jpeg'],
 transformation:{
    width: 400,
    height: 400,
    crop: "auto",
    quality: "auto",     
    fetch_format: "auto"
 }
  }
});
const upload=multer({storage:storage})
const uploadavatart=multer({storage:storageavatar})
const secret="sunoptik"
const options={expiresIn:"24h"}
const app=express();
app.use(express.static("./dist"))
app.use(express.json())
app.use(cookie())

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pins';
async function connect() {
    await mongoose.connect(mongoURI);
}
connect()
/*app.get("/home",async(req,res)=>{
const token=req.cookies.session
if(!token){
    return res.json({log:false})
}
try{
const decode=jwt.verify(token,secret)
return res.json({
    log:true,
    user:{login:decode.login,createdAt:decode.createdAt}
})
}
catch{
    return res.status(500).json({log:false})
}
})*/
app.get("/post/:id",async(req,res)=>{
    try{
    const id=req.params.id
    const document=await posts.findOne({_id:id})
    res.status(200).json({
        head:document.head,
        description:document.description,
        body:document.body
    })
    }
    catch{
        console.log(1)
        res.status(500).json({
            message:"пост не найден"
        })
    }
})
app.get("/profile",async(req,res)=>{
    const token=req.cookies.session
    if(!token){
        return res.status(401).json({error:"неавторизован"})
    }
    try{
        const decode=jwt.verify(token,secret)
        const user=await users.findOne({login:decode.login})
        const count =await posts.countDocuments({author:user._id})
        res.status(200).json({count:count,user:user}) 
    }
    catch{
        res.status(401).json({error:"сессия истекла"})
    }
    
})
app.post("/profile/edit/avatar",uploadavatart.single("avatar"),async(req,res)=>{
    try{    
        const token=req.cookies.session
        const decode=jwt.verify(token,secret)
        const avatar=req.file
        const url=avatar.path
        const id=avatar.filename
        const user=await users.findOne({login:decode.login})
        if(user.imgId){
        await cloudinary.uploader.destroy(user.imgId)
    }
    await users.updateOne({login:decode.login},{imgUrl:url,imgId:id})
        res.status(200).json({
            url:url
        })}
    catch{
        res.status(401).json({
            error:"сессия истекла"
        })
    }
})
app.get("/profile/edit/password",async(req,res)=>{
    res.sendFile(path.join(__dirname,"dist","index.html"))
})
app.post("/profile/edit/password",async(req,res)=>{
    try{
        const token=req.cookies.session
        const data=req.body
        const decode=jwt.verify(token,secret)
        const newpassword=crypto.createHash("sha256").update(data.password).digest("hex")
        await users.updateOne({login:decode.login},{password:newpassword})
        res.status(200).json({
            message:"пароль обновлён"
        })
    }
    catch{
        res.status(400).json({
            message:"сессия истекла"
        })
    }
})
app.get("/login",async(req,res)=>{
    res.sendFile(path.join(__dirname,"dist","index.html"))
})
app.post("/login",async(req,res)=>{
const {login,password,role}=req.body
const payload={login:login,role:role,}
const check =await users.findOne({login:login})
const hex=crypto.createHash("sha256").update(password).digest("hex")
if(check&&check.password===hex){
    const payload = { login: login, role: role || check.role,createdAt:check.createdAt };
    const token = jwt.sign(payload, secret, options);
    res.cookie("session",token,{
        httpOnly:true,
        secure:false,
        maxAge:60*60*24*1000
    })
    return res.status(200).json({
        login: login,
    })
}
else{
    return res.status(400).json({
        message:"Неверный логин или пароль"
    })
}
})
app.post("/reg",async(req,res)=>{
const {login,password,role}=req.body
const hex=crypto.createHash("sha256").update(password).digest("hex")
const check = await users.find({login:login})
if(check.length===0){
const new_user=new users({login:login,password:hex,role:role,createdAt:new Date()})
await new_user.save();
return res.status(201).json({message:"регистрация прошла успешно"})
}
else{
    return res.status(400).json({ 
        success: false, 
        message: "Этот логин уже занят. Придумайте другой." 
      });
}
})
app.get("/addpost",async(req,res)=>{

})
app.post("/addpost", upload.array("img"),async(req,res)=>{
    const head=req.body.head
    const description=req.body.description
    const post=JSON.parse(req.body.text)
    const imgmap={}
    if(req.files && req.files.length>0){
        req.files.forEach(f=>{
            const name=f.originalname.split(".")[0]
            imgmap[name]={
                url:f.path,
                id:f.filename
            }
        })
    }
    const updatedocument=post.map((d)=>{
        if(d.type==="img"&&imgmap[d.id]){
            return{
                ...d,
                cloudid:imgmap[d.id].id,
                url:imgmap[d.id].url,
                description:d.description
            }
        }
        else{
            return d
        }
    })
    const token=req.cookies.session
    try{
        const decode=jwt.verify(token,secret)
        const id=await users.findOne({login:decode.login})
        const post=new posts({
        head:head,
        description:description,
        body:updatedocument,
        author:id._id,
        createdAt:new Date()
        })
        await post.save()
        res.status(200).json({message:"пост сохранён"})
    }
    catch{
        res.status(500).json({message:"ошибка сохранения поста"})
    }
})
app.get("/post",async (req,res)=>{
    const data=await posts.find({})
    res.json({document:data})
})
app.get("/userposts",async(req,res)=>{
    try{
    const data=req.cookies.session
    try{
        const decode=jwt.verify(data,secret)
        const userid=await users.findOne({login:decode.login})
        const answer=await posts.find({author:userid._id})
        res.status(200).json({
            documents:answer
        })
    }
    catch{
        res.status(500).json({
            message:"ошибка на сервере"
        })
    }
    }
    catch{
        res.status(401).json({
            message:"пользователь не авторизован"
        })
    }
})
app.get("/userposts/:id",async(req,res)=>{
    try{
    const params=req.params.id
    const d=await posts.findOne({_id:params})
    res.status(200).json({
        head:d.head,
        description:d.description,
        body:d.body
    })
    }
    catch{
        res.status(500).json({
            message:"ошибка данных на сервере"
        })
    }
})
app.delete("/userposts/:id",async(req,res)=>{
    try{
    const params=req.params.id
    const post=await posts.findOne({_id:params})
    const document=post.body
    const promise=[]
    document.map((d)=>{
        if(d.type==="img"){
            return promise.push(d.cloudid)
        }
        else {return null}
    })
    await Promise.all(promise.map(id=>(cloudinary.uploader.destroy(id))))
    const result=await posts.deleteOne({_id:params})
     res.status(200).json({
            message:"удаление прошло успешно"
        })
    }
    catch{
        res.status(500).json({
            message:"ошибка с удалением поста"
        })
    }
})
app.post("/userposts/:id", upload.array("img"),async(req,res)=>{
    try{
        const params=req.params.id
        const post=await posts.findOne({_id:params})
        const head=req.body.head
        const description=req.body.description
        const body=JSON.parse(req.body.body)
        const imgmap={}
        if(req.files&&req.files.length>0){
            req.files.forEach((f)=>{
                const id=f.originalname.split(".")[0]
                imgmap[id] = { id: f.filename, url: f.path };
            })
        }
        const changebody=body.map((b)=>{
            if(b.type==="img"){
                if(b.change===true&&imgmap[b.id]){
                    return{
                        id:b.id,
                        type:"img",
                        cloudid:imgmap[b.id].id,
                        url:imgmap[b.id].url,
                        description:b.description
                    }
                }
                else{
                   return{
                    id:b.id,
                    type:"img",
                    cloudid:b.cloudid,
                    url:b.url,
                    description:b.description
                   } 
                }
            }
            else{
                return b
            }
        })
    const newCloudIds = new Set(
    changebody
    .filter(b => b.type === "img" && b.cloudid)
    .map(b => b.cloudid)
    );
    const imagesToDelete = post.body
    .filter(b => b.type === "img" && b.cloudid && !newCloudIds.has(b.cloudid))
    .map(b => b.cloudid);
    if (imagesToDelete.length > 0) {
    await Promise.all(imagesToDelete.map(id => cloudinary.uploader.destroy(id)));}
    await posts.updateOne({_id:params},{body:changebody,head:head,description:description})
    res.status(200).json({
        message:"Обновление прошло успешно"
    })
    }
    catch{
        res.status(500).json({
            message:"ошибка на сервере"
        })
    }
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});