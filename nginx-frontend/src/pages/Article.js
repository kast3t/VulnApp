import CategoriesSidebar from '../components/CategoriesSidebar'
import Comments from '../components/Comments'
import DateToString from '../components/DateToString'
import LeaveComment from '../components/LeaveComment'
import Loading from '../components/Loading'
import TextWithParagraphs from '../components/TextWithParagraphs'
import { ArticleAPI } from '../apis/ArticleAPI'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'


export default function Article() {
  const { article_id } = useParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const get_article_handler = async () => {
    try {
      const article = await ArticleAPI.get_by_id(article_id)
      setIsLoading(false)
      setArticle(article)
    } catch (err) {
      if (err.code == 404) {
        navigate("/404")
      } else {
        toast.error(err.final_msg)
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    get_article_handler()
  }, [])

  return (
    <section className="site-section py-lg">
      <div className="container">
        <div className="row blog-entries">
          <div className="col-md-12 col-lg-8 main-content">
            {isLoading && (
              <Loading size="10" />
            )}

            {!isLoading && (<>
              {article.image && (
                <img src={article.image}
                  className="img-fluid mb-5 unselectable"
                  onError={(e) => { e.target.onError = null; e.target.remove() }}
                />
              )}

              <div className="post-meta unselectable">
                <span className="author mr-2">{article.author}</span> • <span className="mr-2">
                  <DateToString dateFromAPI={article.created} />
                </span>
              </div>

              <h1 className="mb-4 unselectable">{article.title}</h1>

              {article.category && (
                <Link to={"/?category=" + article.category} className="category mb-5 unselectable">{article.category}</Link>
              )}

              <div className="post-content-body">
                <TextWithParagraphs text={article.text} />
              </div>
            </>)}

            <div className="pt-5">
              <h3 className="mb-5 unselectable">Комментарии</h3>

              {isLoading && (
                <Loading size="10" />
              )}

              {!isLoading && (
                <Comments comments={article.comments} get_article_handler={get_article_handler} />
              )}

              <LeaveComment get_article_handler={get_article_handler} />
            </div>
          </div>

          <CategoriesSidebar />
        </div>
      </div>
    </section>
  )
}
