import { AccountUpdateSchema } from '../validators'
import { AuthAPI } from '../apis/AuthAPI'
import { Formik, Form, Field } from 'formik'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAccount } from '../hooks/useAccount'
import { useDispatch } from 'react-redux'
import { login } from '../store/user/userSlice'


export default function Profile() {
  const dispatch = useDispatch()
  const account = useAccount()

  const update_account_handler = async (values, resetForm) => {
    try {
      if (!values.email.trim()) {
        delete values.email
      }
      if (!values.password.trim()) {
        delete values.password
      }

      if (values.email || values.password) {
        const data = await AuthAPI.update_account({ ...values })
        dispatch(login(data))
        resetForm()
        toast.success("Данные аккаунта успешно обновлены")
      }
    } catch (err) {
      if (err.code == 400 || err.code == 409) {
        toast.error(err.msg_from_API)
      } else {
        toast.error(err.final_msg)
      }
    }
  }

  return (
    <section className="site-section unselectable">
      <div className="container">
        <div className="mb-4">
          <div className="col-md-6">
            <h1>Профиль</h1>
          </div>
        </div>

        <div className="col-md-12 form-group">
          <label for="username">Username</label>
          <input name="username" type="username" className="form-control" value={account.username} disabled />
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={AccountUpdateSchema}
          onSubmit={(values, { resetForm }) => { update_account_handler(values, resetForm) }}>

          {({ dirty, errors, isValid, touched }) => (
            <Form>
              <div className="col-md-12 form-group">
                <label for="email">Email</label>
                {errors.email && touched.email ? (<div style={{ color: "red" }}>{errors.email}</div>) : null}
                <Field name="email" type="email" className="form-control" placeholder={account.email} />
              </div>

              <div className="col-md-12 form-group">
                <label for="password">Пароль</label>
                {errors.password && touched.password ? (<div style={{ color: "red" }}>{errors.password}</div>) : null}
                <Field name="password" type="password" className="form-control" placeholder="введите новый пароль" />
              </div>

              <div className="col-md-6 form-group">
                <input type="submit" value="Обновить данные" className="btn btn-primary" disabled={!(isValid && dirty)} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  )
}
