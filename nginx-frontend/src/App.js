import './css/bootstrap.css'
import './css/style.css'
import Admin from './pages/admin/Admin'
import Article from './pages/Article'
import EntityAddEdit from './pages/admin/EntityAddEdit'
import Error from './pages/Error'
import Footer from './components/Footer'
import Header from './components/Header'
import LastArticles from './pages/LastArticles'
import LoginForm from './pages/LoginForm'
import Profile from './pages/Profile'
import RegisterForm from './pages/RegisterForm'
import { AuthAPI } from './apis/AuthAPI'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { login, logout } from './store/user/userSlice'
import { RequireAuth, RequireNotAuth } from './components/RequireAuth'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'


export default function App() {
  const dispatch = useDispatch()

  const first_check_is_auth_handler = async () => {
    try {
      const data = await AuthAPI.get_account()
      dispatch(login(data))
    } catch (err) {
      dispatch(logout())
      if (err.code == 401 && err.msg_from_API === "Missing cookie \"access_token_cookie\"") { }
      else {
        toast.error(err.final_msg)
      }
    }
  }

  useEffect(() => {
    first_check_is_auth_handler()
  }, [])

  return (
    <BrowserRouter>
      <div className="wrap">
        <Header />
        <Routes>
          <Route index element={<LastArticles />} />
          <Route path="register" element={<RequireNotAuth> <RegisterForm /> </RequireNotAuth>} />
          <Route path="login" element={<RequireNotAuth> <LoginForm /> </RequireNotAuth>} />
          <Route path="profile" element={<RequireAuth> <Profile /> </RequireAuth>} />
          <Route path="article/:article_id" element={<Article />} />
          <Route path="admin" element={<RequireAuth> <Admin /> </RequireAuth>} />
          <Route path="admin/users/add"
            element={<RequireAuth> <EntityAddEdit actionType="add" entityType="user" /> </RequireAuth>}
          />
          <Route path="admin/users/:user_id/edit"
            element={<RequireAuth> <EntityAddEdit actionType="edit" entityType="user" /> </RequireAuth>}
          />
          <Route path="admin/articles/add"
            element={<RequireAuth> <EntityAddEdit actionType="add" entityType="article" /> </RequireAuth>}
          />
          <Route path="admin/articles/:article_id/edit"
            element={<RequireAuth> <EntityAddEdit actionType="edit" entityType="article" /> </RequireAuth>}
          />
          <Route path="*" element={<Error error_code="404" error_msg="Страница не найдена" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter >
  )
}
