import { Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Navbar.Brand href="/dashboard">Social-Chat</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/create/movie">Movies</Nav.Link>
          <Nav.Link href="/create/todo">ToDo</Nav.Link>
          <Nav.Link href="/fav/movie">Fav-Movies</Nav.Link>
          <Nav.Link href="/blog">Blog</Nav.Link>
          <Nav.Link
            as="button"
            onClick={handleLogout}
            className="logout-button"
          >
            <b>Logout</b>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default Menu;
