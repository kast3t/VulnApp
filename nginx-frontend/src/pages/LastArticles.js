import ArticlePreview from '../components/ArticlePreview'
import CategoriesSidebar from '../components/CategoriesSidebar'
import Loading from '../components/Loading'
import { ArticleAPI } from '../apis/ArticleAPI'
import { createRef, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'


export default function LastArticles() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchParams, ] = useSearchParams()
  const queryParamCategory = searchParams.get("category")
  const categoryRef = createRef()

  const get_all_articles_handler = async () => {
    try {
      setArticles([])
      const articles = await ArticleAPI.get_all()
      setIsLoading(false)
      setArticles(articles)
    } catch (err) {
      toast.error(err.final_msg)
    }
  }

  const get_all_articles_by_category_handler = async () => {
    try {
      setArticles([])
      const articles = await ArticleAPI.get_all_by_category(queryParamCategory)
      setIsLoading(false)
      setArticles(articles)
    } catch (err) {
      toast.error(err.final_msg)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsLoading(true)

    if (queryParamCategory) {
      get_all_articles_by_category_handler()
      categoryRef.current.innerHTML = queryParamCategory
    } else {
      get_all_articles_handler()
    }
  }, [queryParamCategory])

  return (
    <section className="site-section unselectable">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="mb-4">Последние посты</h2>

            {queryParamCategory && (
              <div>
                Категория: <div ref={categoryRef} class="category mb-5 unselectable"></div>
              </div>
            )}
          </div>
        </div>

        <div className="row blog-entries">
          <div className="col-md-12 col-lg-8 main-content">
            {isLoading && (
              <Loading size="5" />
            )}

            {!isLoading && articles.length == 0 && (
              <h4 style={{ fontSize: "3rem", paddingTop: "2em", paddingBottom: "2em" }} className="text-center display-1">
                Посты не найдены :С
              </h4>
            )}

            <div className="row">
              {articles.map(article => (
                <ArticlePreview
                  article_id={article.id}
                  image={article.image}
                  author={article.author_id}
                  created_at={article.created}
                  title={article.title}
                />
              ))}
            </div>
          </div>

          <CategoriesSidebar />
        </div>
      </div>
    </section>
  )
}
