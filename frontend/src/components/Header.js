
import React, { useContext, useState } from "react";
import {
  Navbar,
  Nav,
  Form,
  Button,
  FormControl,
  Container,
} from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import history from "../history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSignInAlt,
  faUserCircle,
  faList,
  faMapMarked,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import userContext from "../state/UserContext";

const Header = () => {
  const [field, setField] = useState("id");
  const [search, setSearch] = useState("");

  const context = useContext(userContext);

  const onSearch = (e) => {
    e.preventDefault();
    history.push(`${process.env.PUBLIC_URL}/search/${field}/${search == "" ? "all" : search}`);
  };

  const handleFieldChange = (e) => {
    setField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Navbar collapseOnSelect className="header navbar-dark" expand="lg">
      <Container>
        <Navbar.Brand className="brand">WanderBus HK</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link eventKey="1">
                <Link to={`${process.env.PUBLIC_URL}/list`} className="header-link">
                  List
                  <FontAwesomeIcon
                    className="fa-list"
                    icon={faList}
                  ></FontAwesomeIcon>
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="2">
                <Link to={`${process.env.PUBLIC_URL}/map`} className="header-link">
                  Map
                <FontAwesomeIcon
                    className="fa-map "
                    icon={faMapMarked}
                  ></FontAwesomeIcon>
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="3">
                <Link to={`${process.env.PUBLIC_URL}/about`} className="header-link">
                  About
                <FontAwesomeIcon className="fa-info" icon={faInfo} />
                </Link>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav.Item>
            <Nav.Link>
              <div className="searchbar">
                <Form inline onSubmit={onSearch}>
                  <FormControl
                    type="text"
                    placeholder="Search"
                    onChange={handleSearchChange}
                    value={search}
                    className="mr-sm-2 searchbar-text"
                  />
                  <Form.Control
                    className="searchSelect"
                    as="select"
                    onChange={handleFieldChange}
                    value={field}
                    custom
                  >
                    <option value="id">ID</option>
                    <option value="name"> Name</option>
                    <option value="lat">Lat</option>
                    <option value="long">Lng</option>
                    {context.user.logged_in ? (
                      <option value="nearby">Nearby(km)</option>
                    ) : (
                        <></>
                      )}
                  </Form.Control>
                    <Button
                      type="submit"
                      variant="secondary"
                      className="searchbar-button"
                    >
                      <FontAwesomeIcon icon={faSearch} className="searchbar-icon" />
                    </Button>
                </Form>
              </div>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="header-link login-status">
            <Nav.Link eventKey="4">
              <Link
                to={context.user.isAdmin ? `${process.env.PUBLIC_URL}/admin` : `${process.env.PUBLIC_URL}/`}
                className="header-link"
              >
                {context.user.logged_in ? (
                  <>
                    {context.user.username}
                    <FontAwesomeIcon
                      className="fa-user"
                      icon={faUserCircle}
                    ></FontAwesomeIcon>
                  </>
                ) : (
                    <>
                      {"Log In"}
                      <FontAwesomeIcon
                        className="fa-signin"
                        icon={faSignInAlt}
                      ></FontAwesomeIcon>
                    </>
                  )}
              </Link>
            </Nav.Link>
          </Nav.Item>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
