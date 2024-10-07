import { AuthAPI } from '../apis/AuthAPI'
import { Formik, Form, Field } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/user/userSlice'
import { SignupSchema } from '../validators'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'


export default function RegisterForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const register_handler = async (values) => {
    try {
      const data = await AuthAPI.register({ ...values })
      dispatch(login(data))
      toast.success("Аккаунт успешно зарегистрирован")
      navigate("/")
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
            <h1>Регистрация</h1>
          </div>
        </div>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => { register_handler(values) }}>

          {({ dirty, errors, isValid, touched }) => (
            <Form>
              <div className="col-md-12 form-group">
                <label for="username">Username</label>
                {errors.username && touched.username ? (<div style={{ color: "red" }}>{errors.username}</div>) : null}
                <Field name="username" type="username" className="form-control" />
              </div>

              <div className="col-md-12 form-group">
                <label for="email">Email</label>
                {errors.email && touched.email ? (<div style={{ color: "red" }}>{errors.email}</div>) : null}
                <Field name="email" type="email" className="form-control" />
              </div>

              <div className="col-md-12 form-group">
                <label for="password">Пароль</label>
                {errors.password && touched.password ? (<div style={{ color: "red" }}>{errors.password}</div>) : null}
                <Field name="password" type="password" className="form-control" />
              </div>

              <div className="col-md-6 form-group">
                <input type="submit" value="Зарегистрироваться" className="btn btn-primary" disabled={!(isValid && dirty)} />
              </div>
            </Form>
          )}
        </Formik>

        <div className="mb-4 pb-4">
          <div className="col-md-6">
            <Link style={{ color: "black", textDecoration: "underline" }} to="/login">Уже есть аккаунт?</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
