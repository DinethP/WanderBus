
import React, { useState, useContext, forwardRef, useEffect } from "react";
import locationContext from "../state/LocationContext";
import { Tooltip, OverlayTrigger, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const EtaTable = (props) => {
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  const locationCtx = useContext(locationContext);

  const [state, setState] = useState({
    columns: [
      { title: "Route", field: "route_id" },
      { title: "ETA", field: "eta" },
    ],
    data: [],
    lastFetch: new Date().toTimeString().slice(0, 8),
  });

  useEffect(() => {
    syncETA();
    setInterval(syncETA, 5000);
  }, []);

  const syncETA = () => {
    locationCtx.getETA(props.stop_id).then((routes) => {
      if (routes) {
        let data = [];
        routes.map((route) => {
          route.eta.map((time, idx) => {
            let datum = {
              id: route.route_id + idx,
              route_id: route.route_id,
              eta: time + " mins",
              type: idx ? "child" : "adult",
            };
            if (idx) datum["parentId"] = route.route_id + "0";
            data.push(datum);
          });
        });
        setState({
          ...state,
          data: data,
          lastFetch: new Date().toTimeString().slice(0, 8),
        });
      }
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h5>Estimated time of arrival(ETA)</h5>
        <div>{"last fetch: " + state.lastFetch}</div>
      </div>
      <MaterialTable
        title=""
        columns={state.columns}
        data={state.data}
        icons={tableIcons}
        parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
      />
    </>
  );
};

export default EtaTable;
