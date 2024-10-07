import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { AuthAPI } from '../apis/AuthAPI'
import { Link, useNavigate } from 'react-router-dom'
import { list_of_categories } from './CategoriesSidebar'
import { logout } from '../store/user/userSlice'
import { toast } from 'react-toastify'
import { useAccount } from '../hooks/useAccount'
import { useDispatch } from 'react-redux'
import { useIsAuth } from '../hooks/useIsAuth'


export default function Header() {
  const [isAuth, isLoading] = useIsAuth()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const account = useAccount()

  const logout_handler = async () => {
    try {
      const data = await AuthAPI.logout()
      dispatch(logout())
      toast.success(data.msg)
      navigate("/")
    } catch (err) {
      toast.error(err.final_msg)
    }
  }

  return (
    <header role="banner">
      <div className="container logo-wrap unselectable">
        <div className="row pt-5">
          <div className="col-12 text-center">
            <h1 className="site-logo"><Link to="/">VulnApp</Link></h1>
          </div>
        </div>
      </div>

      {!isLoading && (
        <Navbar>
          <Container>
            <Navbar.Collapse id="navbarMenu">
              <Nav className="mx-auto unselectable">
                <Nav.Link as={Link} to="/">Главная</Nav.Link>
                <NavDropdown title="Категории" id="basic-nav-dropdown">
                  {list_of_categories.map(category => (
                    <NavDropdown.Item as={Link} to={"/?category=" + category}>{category}</NavDropdown.Item>
                  ))}
                </NavDropdown>
                <Nav.Link as={Link} to="answers">Ответы</Nav.Link>
                {isAuth && (<>
                  <Nav.Link as={Link} to="profile">Профиль</Nav.Link>
                  {account.is_admin && (
                    <Nav.Link as={Link} to="admin">Админка</Nav.Link>
                  )}
                  <Nav.Link as={Link} onClick={logout_handler} style={{ color: "red" }}>Выйти</Nav.Link>
                </>)}
                {!isAuth && (<>
                  <Nav.Link as={Link} to="register">Регистрация</Nav.Link>
                  <Nav.Link as={Link} to="login">Войти</Nav.Link>
                </>)}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </header>
  )
}
