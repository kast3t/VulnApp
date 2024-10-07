import { Link } from 'react-router-dom'


export const list_of_categories = ["Анеки", "Веб-уязвимости", "Сети", "Цитаты"]

export default function CategoriesSidebar() {
  return (
    <div className="col-md-12 col-lg-4 sidebar unselectable">
      <div className="sidebar-box">
        <h3 className="heading">Категории</h3>

        <ul className="categories">
          {list_of_categories.map(category => (
            <li><Link to={"/?category=" + category}>{category}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
