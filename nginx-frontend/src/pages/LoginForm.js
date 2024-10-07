import Timer from '../components/Timer'
import { AuthAPI } from '../apis/AuthAPI'
import { Formik, Form, Field } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { LoginSchema } from '../validators'
import { login } from '../store/user/userSlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useState } from 'react'


export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loginRetries, setLoginRetries] = useState(0)
  const [timerIsRun, setTimerIsRun] = useState(false)

  const login_handler = async (values) => {
    try {
      const data = await AuthAPI.login({ ...values })
      dispatch(login(data))
      navigate("/")
    } catch (err) {
      if (err.code == 401 || err.code == 404) {
        setLoginRetries(loginRetries + 1)
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
            <h1>Войти</h1>
          </div>
        </div>

        {loginRetries == 3 && (
          <div className="col-md-12 form-group" style={{ color: "red" }}>
            Слишком много попыток входа. Вы можете продолжить попытки входа через: <Timer
              initSeconds={90}
              setTimerIsRun={setTimerIsRun}
              setLoginRetries={setLoginRetries}
            />
          </div>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={(values) => { login_handler(values) }}>

          {({ dirty, errors, isValid, touched }) => (
            <Form>
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
                <input type="submit" value="Войти" className="btn btn-primary" disabled={!(isValid && dirty) || timerIsRun} />
              </div>
            </Form>
          )}
        </Formik>

        <div className="mb-4 pb-4">
          <div className="col-md-6">
            <Link style={{ color: "black", textDecoration: "underline" }} to="/register">Нет аккаунта?</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
