
import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPencilAlt,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../state/UserContext";
import LocationContext from "../state/LocationContext";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { Form, Tooltip, OverlayTrigger } from "react-bootstrap";

const port = "/2053/";

const StopCard = (props) => {
  const [clicked, setClicked] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    id: props.id,
    name: props.name,
    lat: parseFloat(props.lat).toFixed(5),
    long: parseFloat(props.long).toFixed(5),
    company: props.company,
  });
  const [oldData, setOldData] = useState(formData);
  const UserCtx = useContext(UserContext);
  const LocCtx = useContext(LocationContext);
  const history = useHistory();

  const handleClick = () => {
    console.log(props.page);
    if (!isUpdate && props.page !== "location") setClicked(true);
    // console.log(props.match.params);
  };

  const handleDelClick = (e) => {
    e.stopPropagation();
    let ans = window.confirm("Are you sure you want to delete this stop?");
    if (ans == true) {
      LocCtx.deleteLoc(props.id);
      if (props.page === "location") {
        history.push("/list");
      }
    }
  };

  const handleUpdateClick = (e) => {
    e.stopPropagation();
    setIsUpdate(true);
  };

  const handleTickClick = (e) => {
    e.stopPropagation();
    setIsUpdate(false);
    LocCtx.updateLoc(oldData.id, formData);
    setOldData(formData);
  };

  const handleCrossClick = (e) => {
    e.stopPropagation();
    setIsUpdate(false);
    setFormData(oldData);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return clicked ? (
    <Redirect to={`${process.env.PUBLIC_URL}/location/${props.id}`} />
  ) : (
    <tr onClick={handleClick}>
      <td>
        {isUpdate ? (
          <Form.Group>
            <Form.Control
              name="id"
              type="text"
              value={formData.id}
              onChange={handleChange}
              required
            ></Form.Control>
          </Form.Group>
        ) : (
          formData.id
        )}
      </td>
      <td>
        {isUpdate ? (
          <Form.Group>
            <Form.Control
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
        ) : (
          formData.name
        )}
      </td>
      <td>
        {isUpdate ? (
          <Form.Group>
            <Form.Control
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              required
            ></Form.Control>
          </Form.Group>
        ) : (
          formData.company
        )}
      </td>
      <td>
        {isUpdate ? (
          <Form.Group>
            <Form.Control
              name="lat"
              type="text"
              value={formData.lat}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
        ) : (
          formData.lat
        )}
      </td>
      <td>
        {isUpdate ? (
          <Form.Group>
            <Form.Control
              name="long"
              type="text"
              value={formData.long}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
        ) : (
          formData.long
        )}
      </td>
      <td>{props.no_comments}</td>
      <td>{props.favourite}</td>
      {UserCtx.user.isAdmin && !isUpdate ? (
        <td>
          <OverlayTrigger
            placement={"bottom"}
            overlay={<Tooltip>Delete stop</Tooltip>}
          >
            <FontAwesomeIcon
              className="fa-trash"
              icon={faTrashAlt}
              onClick={handleDelClick}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement={"bottom"}
            overlay={<Tooltip>Edit stop</Tooltip>}
          >
            <FontAwesomeIcon
              className="fa-pencil-alt"
              icon={faPencilAlt}
              onClick={handleUpdateClick}
            />
          </OverlayTrigger>
        </td>
      ) : isUpdate ? (
        <td>
          <OverlayTrigger
            placement={"bottom"}
            overlay={<Tooltip>Confirm edit</Tooltip>}
          >
            <FontAwesomeIcon
              className="fa-check"
              icon={faCheck}
              onClick={handleTickClick}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement={"bottom"}
            overlay={<Tooltip>Discard edit</Tooltip>}
          >
            <FontAwesomeIcon
              className="fa-times"
              icon={faTimes}
              onClick={handleCrossClick}
            />
          </OverlayTrigger>
        </td>
      ) : (
        <></>
      )}
    </tr>
  );
};

export default StopCard;
