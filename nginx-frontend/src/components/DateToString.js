export default function DateToString(props) {
    const date_created_at = new Date(props.dateFromAPI)
    const str_created_at = date_created_at.toLocaleDateString("ru-RU") + ", в " + date_created_at.toLocaleTimeString("ru-RU")

    return str_created_at
}
