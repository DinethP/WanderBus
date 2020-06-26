
import React, { useContext, useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import locationContext from "../state/LocationContext";
import UserContext from "../state/UserContext";
import LocationTable from "./LocationTable";

const ListPage = () => {
  const locsCtx = useContext(locationContext);
  const userCtx = useContext(UserContext);
  const [isFlushing, setIsFlushing] = useState(false);
  const history = useHistory();

  const handleFlush = () => {
    setIsFlushing(true);
    locsCtx.reloadData().then((flag) => {
      if (flag) setIsFlushing(false);
      else console.log("Flushing error");
    });
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    history.push(`${process.env.PUBLIC_URL}/locationForm`);
  };

  return (
    <Container className="mt-3">
      {userCtx.user.isAdmin ? (
        <>
          <Button
            variant="primary"
            type="submit"
            onClick={handleCreateClick}
            className="mr-2"
          >
            Create
          </Button>
          <Button variant="secondary" type="submit" onClick={handleFlush}>
            {isFlushing ? (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            ) : (
              <>Flush Data</>
            )}
          </Button>
        </>
      ) : (
        <></>
      )}

      <LocationTable
        locations={locsCtx.locations}
        page={window.location.href.split("/")[3]}
      />
    </Container>
  );
};

export default ListPage;
