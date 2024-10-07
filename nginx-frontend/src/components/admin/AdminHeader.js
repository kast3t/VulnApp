import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'


export default function AdminHeader() {
  return (
    <Navbar>
      <Container>
        <Navbar.Collapse id="navbarMenu" style={{ borderBottom: "0px", paddingBottom: "25px" }}>
          <Nav className="mx-auto unselectable">
            <Nav.Link as={Link} to="?tab=users">Пользователи</Nav.Link>
            <Nav.Link as={Link} to="?tab=articles">Статьи</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
