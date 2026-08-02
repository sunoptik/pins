import { Helmet, HelmetProvider } from "react-helmet-async";
import "./style.css";
const categories = [
  { id: "cars", title: "Автомобили", image: "/car.webp" },
  { id: "tech", title: "Программирование и технологии", image: "/it_tecnologia.webp" },
  { id: "travel", title: "Путешествия", image: "/travel.webp" },
  { id: "cooking", title: "Готовка", image: "/cooking.webp" },
  { id: "finance", title: "Бизнес и деньги", image: "/money.webp" },
  { id: "art", title: "Творчество", image: "/art.webp" },
  { id: "cinema", title: "Фильмы", image: "/cinema.webp" },
  { id: "music", title: "Музыка", image: "/music.webp" },
  { id: "psychology", title: "Психология", image: "/psychologi.webp" }
];
export default function Category(){
    return (
        <div className="conteiner">
            <div className="tagconteiner">
            <HelmetProvider>
                <Helmet><title>Категории</title></Helmet>
            </HelmetProvider>
            {categories.map((tag)=>{
                return (<div key={tag.id} className="tag">
                    <img src={tag.image} alt={tag.title} />
                    <div className="blurbg">
                    <h3>{tag.title}</h3>
                    </div>
                </div>)
            })}
            </div>
        </div>
    )
}