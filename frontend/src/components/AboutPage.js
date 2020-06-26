import React from "react";
import { Container, ListGroup, Table, Image } from "react-bootstrap";

const AboutPage = () => {
  return (
    <Container className="mt-5">
      <h3>About This Project</h3>
      <ListGroup className="mt-5 mb-5">
        <ListGroup.Item>
          <h4 className="mb-4">Features</h4>
          <h5>User:</h5>{" "}
          <p>
            The users can create a new account or login to their preexisting
            one. Once logged in they can add locations to their favorites (which
            will show on their user page), and also comment on locations. They
            can also see the most popular locations in a chart. The users can
            also set their "home" location from their userpage and find all
            locations that are a certain distance away from their home location
            using the search bar Whether logged in or not they can see all of
            the locations in a list or map, and see comments, and ETA. And also
            sort or search locations using a certain field. The users can see
            the list of locations by going to (/list), and they can see the
            location map by going to (/map). Links are provided in the navbar.
            Clicking a location marker on the map or an entry on the list shows
            the location's page with its information, location on map and ETA.
            The User can comment and add the location to favorites from that
            page
          </p>
          <h5>Admin:</h5>
          <p>
            The admin has the ability to see the most active users by comments
            and favorites. They can also perform CRUD operations on any user or
            location, as well as flushing the entire location database. The
            admin view is accessed by going to /admin. They can see user charts
            and change userdata in their user page (/admin), and they can change
            location data or flush it from the list page (/list)
          </p>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
};

export default AboutPage;
