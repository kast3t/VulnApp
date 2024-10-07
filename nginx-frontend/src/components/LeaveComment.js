import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { ArticleAPI } from "../apis/ArticleAPI"
import { CommentSchema } from "../validators"
import { Formik, Form, Field } from 'formik'
import { toast } from "react-toastify"
import { useAccount } from "../hooks/useAccount"
import { useIsAuth } from "../hooks/useIsAuth"
import { useParams } from "react-router-dom"


const authRequired = "Войдите в аккаунт, чтобы оставить комментарий"

export default function LeaveComment(props) {
    const account = useAccount()
    const { article_id } = useParams()
    const [isAuth, ] = useIsAuth()

    const leave_comment_handler = async (values, resetForm) => {
        try {
            values.author_id = account.id
            await ArticleAPI.add_comment(article_id, values)
            await props.get_article_handler()
            resetForm()
            toast.success("Комментарий успешно добавлен")
        } catch (err) {
            toast.error(err.final_msg)
        }
    }

    return (
        <div className="comment-form-wrap pt-5 unselectable">
            <h3 className="mb-5">Написать комментарий</h3>

            <Formik
                initialValues={{
                    text: "",
                }}
                validationSchema={CommentSchema}
                onSubmit={(values, { resetForm }) => { leave_comment_handler(values, resetForm) }}>

                {({ dirty, isValid }) => (
                    <Form className="p-5 bg-light">
                        <div className="form-group">
                            <label for="text">Сообщение</label>

                            <Field as="textarea" name="text" type="text" cols="30" rows="10" className="form-control"
                                disabled={!isAuth}
                                placeholder={isAuth ? "" : authRequired}
                            />
                        </div>

                        <LeaveCommentButton isAuth={isAuth} isValid={isValid} dirty={dirty} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

function LeaveCommentButton(props) {
    const auth_required_tooltip_handler = (props) => (
        <Tooltip id="tooltip" {...props}>
            {authRequired}
        </Tooltip>
    )

    if (props.isAuth) {
        return (
            <div className="form-group">
                <input type="submit" value="Отправить" className="btn btn-primary" disabled={!(props.isValid && props.dirty)} />
            </div>
        )
    }

    return (
        <div className="form-group">
            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={auth_required_tooltip_handler}
            >
                <input type="submit" value="Отправить" className="btn btn-primary" disabled />
            </OverlayTrigger>
        </div>
    )
}
