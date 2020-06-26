
import React, { useState, useContext, forwardRef, useEffect } from "react";
import userContext from "../state/UserContext";
import { Container, Button } from "react-bootstrap";

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

const UserTable = (props) => {
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

  const userCtx = useContext(userContext);

  const [state, setState] = useState({
    columns: [
      { title: "Username", field: "username" },
      { title: "Password(hashed)", field: "password" },
      { title: "Email", field: "email" },
    ],
    data: [],
  });

  useEffect(() => {
    userCtx.getAllUsers().then((users) => {
      if (users) {
        setState({
          ...state,
          data: users,
        });
      }
    });
  }, []);

  const handleCreateUser = (data) => {
    return new Promise((resolve) => {
      userCtx.createUser(data).then((newUser) => {
        resolve();
        setState((prevState) => {
          const data = [...prevState.data];
          data.push(newUser);
          return { ...prevState, data };
        });
      });
    });
  };

  const handleDelUser = (oldData) => {
    return new Promise((resolve) => {
      userCtx.deleteUser(oldData.username).then((flag) => {
        if (flag) {
          resolve();
          setState((prevState) => {
            const data = [...prevState.data];
            data.splice(data.indexOf(oldData), 1);
            return { ...prevState, data };
          });
        }
      });
    });
  };

  const handleUpdateUser = (newData, oldData) => {
    return new Promise((resolve) => {
      let flag =
        newData.username === oldData.username
          ? newData.password !== oldData.password
            ? true
            : false
          : true;
      if (flag) {
        userCtx.updateUser(oldData.username, newData).then((newUser) => {
          resolve();
          if (oldData) {
            setState((prevState) => {
              const data = [...prevState.data];
              data[data.indexOf(oldData)] = newUser;
              return { ...prevState, data };
            });
          }
        });
      } else {
        resolve();
      }
    });
  };

  return (
    <MaterialTable
      title="Users"
      columns={state.columns}
      data={state.data}
      icons={tableIcons}
      editable={{
        onRowAdd: (data) => handleCreateUser(data),
        onRowUpdate: (newData, oldData) => handleUpdateUser(newData, oldData),
        onRowDelete: (oldData) => handleDelUser(oldData),
      }}
    />
  );
};

export default UserTable;
