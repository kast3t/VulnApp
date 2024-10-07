import DateToString from "./DateToString"
import TextWithParagraphs from "./TextWithParagraphs"
import { CommentAPI } from '../apis/CommentAPI'
import { toast } from "react-toastify"
import { useAccount } from "../hooks/useAccount"


export default function Comments(props) {
    const account = useAccount()

    const comments = props.comments

    const delete_comment_handler = async (comment_id) => {
        try {
            const data = await CommentAPI.delete(comment_id)
            await props.get_article_handler()
            toast.success(data.msg)
        } catch (err) {
            toast.error(err.final_msg)
        }
    }

    if (comments.length == 0) {
        return (
            <h4 className="text-center display-1 unselectable"
                style={{ fontSize: "2rem", paddingTop: "1.5em", paddingBottom: "1.5em" }}
            >
                Комментарии не найдены Т_Т
            </h4>
        )
    }

    return (
        <ul className="comment-list">
            {comments.map(comment => (
                <li className="comment">
                    <div className="comment-body">
                        <div className="row unselectable">
                            <h3 className="col align-self-start">{comment.author}</h3>

                            {account && account.is_admin && (
                                <div className="col align-self-end text-right">
                                    <a style={{ cursor: "pointer" }}
                                        onClick={() => { delete_comment_handler(comment.id) }}
                                    >
                                        ❌
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="meta unselectable">
                            <DateToString dateFromAPI={comment.created} />
                        </div>

                        <TextWithParagraphs text={comment.text} />
                    </div>
                </li>
            ))}
        </ul>
    )
}
