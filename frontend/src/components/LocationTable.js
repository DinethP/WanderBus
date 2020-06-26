
import React, { useState, useContext } from "react";
import { Table } from "react-bootstrap";
import UserContext from "../state/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import StopCard from "./StopCard";

const LocationTable = (props) => {
  const [sortState, setSort] = useState({
    sortName: null,
    reverse: false,
    asc: true,
  });

  const userCtx = useContext(UserContext);

  var locs = props.locations;

  const stringSort = (a, b) => {
    return a.localeCompare(b);
  };

  const numSort = (a, b) => {
    return a - b;
  };

  const sortByName = () => {
    props.locations.sort((a, b) => stringSort(a.name, b.name));
  };

  const sortById = () => {
    props.locations.sort((a, b) => stringSort(a.stop_id, b.stop_id));
  };

  const sortByComments = () => {
    props.locations.sort((a, b) =>
      numSort(a.comments.length, b.comments.length)
    );
  };

  const sortByLat = () => {
    props.locations.sort((a, b) => numSort(a.lat, b.lat));
  };

  const sortByLong = () => {
    props.locations.sort((a, b) => numSort(a.long, b.long));
  };

  const sortByFavourites = () => {
    props.locations.sort((a, b) => numSort(a.favourite, b.favourite));
  };

  const changeSort = (event) => {
    const clicked_name = event.target.getAttribute("name");
    var rev = clicked_name === sortState.sortName;

    if (rev) {
      locs = locs.reverse();
    } else {
      switch (clicked_name) {
        case "id":
          sortById();
          break;
        case "name":
          sortByName();
          break;
        case "lat":
          sortByLat();
          break;
        case "long":
          sortByLong();
          break;
        case "comments":
          sortByComments();
          break;
        case "fav":
          sortByFavourites();
          break;
        default:
          break;
      }
    }

    setSort({
      sortName: clicked_name,
      reverse: rev,
      asc: rev ? !sortState.asc : true,
    });
  };

  return (
    <Table className="loc-table" striped bordered hover>
      <thead>
        <tr>
          <th
            name="id"
            className={sortState.sortName === "id" ? "sort-active" : ""}
            onClick={changeSort}
          >
            ID
            {sortState.sortName === "id" ? (
              sortState.asc ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )
            ) : (
              ""
            )}
          </th>
          <th
            name="name"
            className={sortState.sortName === "name" ? "sort-active" : ""}
            onClick={changeSort}
          >
            Name
            {sortState.sortName === "name" ? (
              sortState.asc ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )
            ) : (
              ""
            )}
          </th>
          <th
            name="company"
            className={sortState.sortName === "company" ? "sort-active" : ""}
            onClick={changeSort}
          >
            Company
            {sortState.sortName === "company" ? (
              sortState.asc ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )
            ) : (
              ""
            )}
          </th>
          <th
            name="lat"
            className={sortState.sortName === "lat" ? "sort-active" : ""}
            onClick={changeSort}
          >
            Lat
            {sortState.sortName === "lat" ? (
              sortState.asc ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )
            ) : (
              ""
            )}
          </th>
          <th
            name="long"
            className={sortState.sortName === "long" ? "sort-active" : ""}
            onClick={changeSort}
          >
            Long
            {sortState.sortName === "long" ? (
              sortState.asc ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )
            ) : (
              ""
            )}
          </th>
          <th
            name="comments"
            className={sortState.sortName === "comments" ? "sort-active" : ""}
            onClick={changeSort}
          >
            Comments
            {sortState.sortName === "comments" ? (
              sortState.asc ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )
            ) : (
              ""
            )}
          </th>
          <th
            name="fav"
            className={sortState.sortName === "fav" ? "sort-active" : ""}
            onClick={changeSort}
          >
            Favourites
            {sortState.sortName === "fav" ? (
              sortState.asc ? (
                <FontAwesomeIcon className="sort-icon" icon={faSortUp} />
              ) : (
                <FontAwesomeIcon className="sort-icon" icon={faSortDown} />
              )
            ) : (
              ""
            )}
          </th>
          {userCtx.user.isAdmin ? <th name="operation">Operations</th> : <></>}
        </tr>
      </thead>
      <tbody>
        {locs.map(function (val, idx) {
          if (val) {
            return (
              <StopCard
                name={val.name}
                id={val.stop_id}
                no_comments={val.comments.length}
                lat={val.lat}
                long={val.long}
                favourite={val.favourite}
                company={val.route_list[0].company}
                key={val.stop_id}
                page={props.page}
              />
            );
          }
        })}
      </tbody>
    </Table>
  );
};

export default LocationTable;
