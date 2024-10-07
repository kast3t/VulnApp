import AdminHeader from '../../components/admin/AdminHeader'
import AdminTable from '../../components/admin/AdminTable'
import Error from '../Error'
import Loading from '../../components/Loading'
import { ArticleAPI } from '../../apis/ArticleAPI'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAccount } from '../../hooks/useAccount'
import { useEffect, useState } from 'react'
import { UserAPI } from '../../apis/UserAPI'


export default function Admin() {
  const account = useAccount()

  const [searchParams, ] = useSearchParams()
  const queryTab = searchParams.get("tab")

  const [entities, setEntities] = useState([])
  const [entitiesLoaded, setEntitiesLoaded] = useState(false)

  const get_all_entities_handler = async () => {
    try {
      switch (queryTab) {
        case "users":
          setEntities(await UserAPI.get_all())
          setEntitiesLoaded(true)
          break
        case "articles":
          setEntities(await ArticleAPI.get_all())
          setEntitiesLoaded(true)
          break
      }
    } catch (err) {
      toast.error(err.final_msg)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    setEntitiesLoaded(false)
    get_all_entities_handler()
  }, [queryTab])

  if (!account.is_admin) return <Error error_code="403" error_msg="Доступ запрещён" />

  return (
    <section className="site-section">
      <div className="container">
        <div className="mb-4 unselectable">
          <div className="col-md-6">
            <h1>Админка</h1>
          </div>
        </div>

        <AdminHeader />

        {!entitiesLoaded && queryTab && (
          <Loading size="10" />
        )}
        {entitiesLoaded && queryTab && (<>
          <div className="text-center unselectable" style={{ paddingBottom: "40px" }}>
            <Link
              style={{ color: "#6610f2", textDecoration: "underline" }}
              to={`${queryTab}/add`}
            >
              Добавить {queryTab === "users" ? "пользователя" : "статью"}
            </Link>
          </div>
          <AdminTable get_all_entities_handler={get_all_entities_handler} entities={entities} queryTab={queryTab} />
        </>)}
      </div>
    </section>
  )
}
