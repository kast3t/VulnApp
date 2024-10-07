import DateToString from './DateToString'
import no_img from '../images/no_img.jpg'
import { Link } from 'react-router-dom'


export default function ArticlePreview(props) {
  const link = "article/" + props.article_id
  const image = props.image ? props.image : no_img

  return (
    <div className="col-md-6">
      <Link to={link} className="blog-entry">
        <img src={image} onError={(e) => { e.target.onError = null; e.target.src = no_img }} />

        <div className="blog-content-body">
          <div className="post-meta">
            <span className="mr-2">
              <DateToString dateFromAPI={props.created_at} />
            </span>
          </div>

          <h2>{props.title}</h2>
        </div>
      </Link>
    </div>
  )
}
