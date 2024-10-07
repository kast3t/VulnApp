import { ArticleAPI } from '../../apis/ArticleAPI'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { UserAPI } from '../../apis/UserAPI'


export default function AdminTable(props) {
  const entityType = props.queryTab
  const entityKeys = ["id", "created", "updated"]
  switch (entityType) {
    case "users":
      entityKeys.push("username", "email", "is_admin")
      break
    case "articles":
      entityKeys.push("author_id", "category", "image", "title", "text")
      break
  }

  const entities = []
  for (const entity of props.entities) {
    const tempObj = {}
    Object.values(entityKeys).forEach(key => tempObj[key] = entity[key])
    entities.push(tempObj)
  }

  const get_formatted_text = (text) => {
    let formatted = text

    if (typeof text === "string") {
      formatted = text.slice(0, 75)
      if (formatted.length < text.length) {
        formatted += "..."
      }
    } else if (typeof text === "boolean") {
      formatted = text.toString()
    }

    return formatted
  }

  const delete_entity_handler = async (entity_id) => {
    try {
      let data
      switch (entityType) {
        case "users":
          data = await UserAPI.delete(entity_id)
          break
        case "articles":
          data = await ArticleAPI.delete(entity_id)
          break
      }
      toast.success(data.msg)
      props.get_all_entities_handler()
    } catch (err) {
      toast.error(err.final_msg)
    }
  }

  return (
    <Table size="sm" bordered striped>
      <thead>
        <tr>
          {entityKeys.map(entityKey => (
            <th>{entityKey}</th>
          ))}
          <th className="unselectable" colSpan={2}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {entities.map((entity) => (
          <tr>
            {Object.values(entity).map((val) => (
              <td>{get_formatted_text(val)}</td>
            ))}
            <td className="unselectable">
              <Link to={`${entityType}/${entity.id}/edit`}>✏️</Link>
            </td>
            <td className="unselectable" onClick={() => { delete_entity_handler(entity.id) }} style={{ cursor: "pointer" }}>❌</td>
          </tr>
        ))}
      </tbody>
    </Table >
  )
}
