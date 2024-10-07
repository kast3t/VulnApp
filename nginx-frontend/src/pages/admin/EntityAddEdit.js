import EntityForm from '../../components/admin/EntityForm'
import Error from '../Error'
import Loading from '../../components/Loading'
import { ArticleAPI } from '../../apis/ArticleAPI'
import { toast } from 'react-toastify'
import { useAccount } from '../../hooks/useAccount'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserAPI } from '../../apis/UserAPI'


export default function EntityAddEdit(props) {
  const account = useAccount()

  const actionType = props.actionType
  const entityType = props.entityType
  const { user_id, article_id } = useParams()

  const [entity, setEntity] = useState({})
  const [entityLoaded, setEntityLoaded] = useState(false)

  const get_entity_handler = async () => {
    if (actionType === "add") {
      setEntity({})
      setEntityLoaded(true)
    } else {
      try {
        switch (entityType) {
          case "user":
            setEntity(await UserAPI.get_by_id(user_id))
            setEntityLoaded(true)
            break
          case "article":
            setEntity(await ArticleAPI.get_by_id(article_id))
            setEntityLoaded(true)
            break
        }
      } catch (err) {
        toast.error(err.final_msg)
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    get_entity_handler()
  }, [])

  if (!account.is_admin) return <Error error_code="403" error_msg="Доступ запрещён" />

  return (
    <section className="site-section unselectable">
      <div className="container">
        <div className="mb-4">
          <h1>Админка. {actionType === "add" ? "Добавление" : "Редактирование"} {entityType === "user" ? "пользователя" : "статьи"}</h1>
        </div>

        {!entityLoaded && (
          <Loading size="10" />
        )}
        {entityLoaded && (
          <EntityForm actionType={actionType} entityType={entityType} entity={entity} />
        )}
      </div>
    </section>
  )
}
