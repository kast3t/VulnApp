import { ArticleAPI } from '../../apis/ArticleAPI'
import { Formik, Form, Field } from 'formik'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { UserAPI } from '../../apis/UserAPI'


export default function EntityForm(props) {
  const navigate = useNavigate()

  const actionType = props.actionType

  const entityType = props.entityType
  const entityKeys = actionType === "edit" ? ["id", "created", "updated"] : []
  switch (entityType) {
    case "user":
      entityKeys.push("username", "email", "is_admin")
      if (actionType === "add") {
        entityKeys.push("password")
      }
      break
    case "article":
      if (actionType !== "add") {
        entityKeys.push("author_id")
      }
      entityKeys.push("category", "image", "title", "text")
      break
  }

  // Сортировка исходной сущности, полученной на входе: пустая при создании, или заполненная при редактировании
  const entity = Object.create(entityKeys)
  Object.values(entityKeys).forEach(key => entity[key] = props.entity[key])

  const action_entity_handler = async (values) => {
    Object.keys(entity).forEach(key => entity[key] === values[key] && delete values[key])

    try {
      if (actionType === "add") {
        if (entityType === "user") {
          await UserAPI.add(values)
        } else {
          await ArticleAPI.add(values)
        }
      } else {
        if (entityType === "user") {
          await UserAPI.edit(entity["id"], values)
        } else {
          await ArticleAPI.edit(entity["id"], values)
        }
      }

      toast.success(`Успешное 
        ${actionType === "add" ? "создание" : "обновление"} 
        ${entityType === "user" ? "пользователя" : "статьи"}`)
      navigate(`/admin?tab=${entityType}s`)
    } catch (err) {
      toast.error(err.final_msg)
    }
  }

  return (
    <Formik
      initialValues={entity}
      onSubmit={(values) => { action_entity_handler(values) }}>

      {({ dirty, isValid }) => (
        <Form>
          {Object.keys(entity).map((key) => {
            if (key !== "text") {
              return (
                <div className="col-md-12 form-group">
                  <label for={key}>{key}</label>
                  <Field name={key} className="form-control" />
                </div>
              )
            } else {
              return (
                <div className="col-md-12 form-group">
                  <label for={key}>{key}</label>
                  <Field as="textarea" name={key} cols="30" rows="10" className="form-control" />
                </div>
              )
            }
          })}

          <div className="col-md-6 form-group">
            <input type="submit" className="btn btn-primary" disabled={!(isValid && dirty)}
              value={actionType === "add" ? "Создать" : "Обновить"}
            />
          </div>
        </Form>
      )}
    </Formik>
  )
}
