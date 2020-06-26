
import React, { useState, useContext } from "react";
import {
  Form,
  Container,
  Tooltip,
  OverlayTrigger,
  Button,
  Alert,
} from "react-bootstrap";
import locationContext from "../state/LocationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileCsv, faMinus } from "@fortawesome/free-solid-svg-icons";
import userContext from "../state/UserContext";

const LocationFormPage = (props) => {
  const LocCtx = useContext(locationContext);
  const userCtx = useContext(userContext);
  const [stopData, setStopData] = useState({
    id: "",
    name: "",
    lat: "",
    long: "",
  });

  const [routeData, setRouteData] = useState([
    { route_id: "", dir: "inbound" },
  ]);
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    LocCtx.addLoc(stopData, routeData).then((flag) => {
      if (flag) setIsCreated(true);
    });
  };

  const handleStopFieldChange = (event) => {
    setStopData({ ...stopData, [event.target.name]: event.target.value });
  };

  const handleRouteFieldChange = (idx) => (event) => {
    const newRoutes = routeData.map((route, ridx) => {
      if (idx !== ridx) return route;
      return { ...route, [event.target.name]: event.target.value };
    });
    setRouteData(newRoutes);
  };

  const handlePlusClick = () => {
    setRouteData(routeData.concat([{ route_id: "", dir: "inbound" }]));
  };

  const handleMinusClick = (idx) => {
    setRouteData(routeData.filter((r, ridx) => idx !== ridx));
  };

  const handleCSVClick = () => {
    document.querySelector("input[type='file']").click();
  };

  const handleCSVChange = (e) => {
    const form = document.querySelector("#csv_form");
    let formData = new FormData(form);
    LocCtx.addCSVLoc(formData).then((flag) => {
      if (flag) setIsCreated(true);
    });
  };

  return !userCtx.user.isAdmin ? (
    <Container className="mb-3 mt-3">
      <h5>Only admin can access this page</h5>
    </Container>
  ) : (
    <Container className="grey-container mb-3 mt-3">
      <div className="d-flex justify-content-between">
        <h5>Create Stop</h5>
        <OverlayTrigger
          placement={"top"}
          overlay={<Tooltip>Create by CSV</Tooltip>}
        >
          <Button variant="success" onClick={handleCSVClick}>
            <form id="csv_form">
              <input
                type="file"
                id="file"
                name="csv"
                hidden
                onChange={handleCSVChange}
              />
            </form>
            <FontAwesomeIcon className="fa-csv" icon={faFileCsv} />
          </Button>
        </OverlayTrigger>
      </div>
      <Alert variant="success" hidden={!isCreated}>
        Stop{stopData.name ? ` " ` + stopData.name + ` "` : "s"} created!
      </Alert>
      <hr />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Stop ID</Form.Label>
          <Form.Control
            name="id"
            type="text"
            placeholder="Stop ID"
            onChange={handleStopFieldChange}
            value={stopData.id}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Stop Name</Form.Label>
          <Form.Control
            name="name"
            type="text"
            placeholder="Stop Name"
            onChange={handleStopFieldChange}
            value={stopData.name}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Latitude</Form.Label>
          <Form.Control
            name="lat"
            type="number"
            placeholder="Latitude"
            onChange={handleStopFieldChange}
            value={stopData.lat}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Longitude</Form.Label>
          <Form.Control
            name="long"
            type="number"
            placeholder="Longitude"
            onChange={handleStopFieldChange}
            value={stopData.long}
            required
          />
        </Form.Group>
        <hr />
        <div className="d-flex justify-content-between">
          <h6>Related Routes</h6>
          <OverlayTrigger
            placement={"top"}
            overlay={<Tooltip>Add Route Row</Tooltip>}
          >
            <Button variant="dark" className="p-1" onClick={handlePlusClick}>
              <FontAwesomeIcon className="fa-plus" icon={faPlus} />
            </Button>
          </OverlayTrigger>
        </div>
        {routeData.map((route, idx) => (
          <div className="d-flex align-center" key={idx}>
            <Form.Group style={{ width: "45%" }}>
              <Form.Label>Route ID</Form.Label>
              <Form.Control
                name="route_id"
                type="text"
                placeholder="Route ID"
                onChange={handleRouteFieldChange(idx)}
                value={route.route_id}
                required
              />
            </Form.Group>
            <Form.Group style={{ width: "45%" }}>
              <Form.Label>Direction</Form.Label>
              <Form.Control
                as="select"
                name="dir"
                onChange={handleRouteFieldChange(idx)}
                value={route.dir}
                custom
              >
                <option value="inbound">inbound</option>
                <option value="outbound">outbound</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="ml-1 btn-minus">
              <OverlayTrigger
                placement={"top"}
                overlay={<Tooltip>Delete Route Row</Tooltip>}
              >
                <Button variant="danger">
                  <FontAwesomeIcon
                    className="fa-minus"
                    icon={faMinus}
                    onClick={() => handleMinusClick(idx)}
                  />
                </Button>
              </OverlayTrigger>
            </Form.Group>
          </div>
        ))}
        <hr />
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
};
export default LocationFormPage;
