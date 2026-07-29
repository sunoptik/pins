import "./style.css"
export default function Post({document}){
  const postDate = new Date(document.createdAt);
  const day=postDate.getDate()
  const month=postDate.getMonth()
  const year=postDate.getFullYear()
  return(<div className="post">
    <h1>{document.head}</h1>
    <h2>{document.description}</h2>
    <p className="postdate">{(day<9?("0"+day):day)+":"+(month<8?"0"+(month+1):(month+1))+":"+year}</p>
  </div>)
}