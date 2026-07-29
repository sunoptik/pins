import { useEffect, useState } from "react"
import "./style.css";
import Masonry from '@mui/lab/Masonry';

export default function pinsContainer(){
const [pins,addPins]=useState([]);
useEffect(()=>{
async function load(){
const responce=await fetch("/")
const pin=await responce.json()
addPins(...pin)
}
load();
},[])
return(
    <div>
        <Masonry columns={5} spacing={1}>
            {pins.map(pin=>(
                <img src="pin.media" alt="img" />
            ))}
        </Masonry>
    </div>
)
}