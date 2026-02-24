import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect, NavLink } from "react-router-dom";
import AddDepartment from "./DepartmentAdd";
import EditDepartmentModal from "./EditDepartmentModal";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import AlertModal from "./AlertModal";

export default class DepartmentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      jobs: [],
      selectedDepartment: null,
      hasError: false,
      errorMsg: "",
      completed: false,
      showEditModel: false,
      showAlertModel: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/departments",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      this.setState({ departments: res.data });
    });
  }

  onEdit(department) {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedDepartment: department, showEditModel: true });
    };
  }

  onDelete(department) {
    return (event) => {
      event.preventDefault();

      if (department.users.length > 0) {
        this.setState({ showAlertModel: true });
      } else {
        axios({
          method: "delete",
          url: "/api/departments/" + department.id,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            this.setState({ completed: true });
          })
          .catch((err) => {
            this.setState({
              hasError: true,
              errorMsg: err.response.data.message,
            });
          });
      }
    };
  }

  render() {
    let closeEditModel = () => this.setState({ showEditModel: false });
    let closeAlertModel = () => this.setState({ showAlertModel: false });

    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "12px 16px",
            fontFamily: '"Inter", sans-serif',
          },
          head: {
            fontWeight: 600,
            color: "var(--text-muted)",
            backgroundColor: "#f8fafc",
          },
        },
        MuiTypography: {
          h6: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: "1.1rem",
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-3">
        <div className="row">
          <div className="col-sm-12">
            <AddDepartment />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <div className="panel-title">
                  <strong>Department List</strong>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    columns={[
                      { title: "DEPT ID", field: "id", width: "10%" },
                      { title: "Department Name", field: "departmentName" },
                      {
                        title: "Jobs",
                        render: (dept) => (
                          <NavLink
                            to={{
                              pathname: "/job-list",
                              state: { selectedDepartment: dept.id },
                            }}
                            className="btn btn-link p-0 text-primary"
                            style={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            View Job List
                          </NavLink>
                        ),
                      },
                      {
                        title: "Action",
                        headerStyle: { textAlign: "right" },
                        cellStyle: { textAlign: "right" },
                        render: (rowData) => (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              size="sm"
                              variant="info"
                              className="btn-sm-action"
                              onClick={this.onEdit(rowData)}
                            >
                              <i className="fas fa-edit mr-1"></i>Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              className="btn-sm-action"
                              onClick={this.onDelete(rowData)}
                            >
                              <i className="fas fa-trash mr-1"></i>Delete
                            </Button>
                          </div>
                        ),
                      },
                    ]}
                    data={this.state.departments}
                    options={{
                      rowStyle: {
                        transition: "background-color 0.2s",
                      },
                      headStyle: {
                        backgroundColor: "#f8fafc",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                      },
                      padding: "normal",
                      pageSize: 10,
                      pageSizeOptions: [5, 10, 20, 50],
                      actionsColumnIndex: -1,
                      searchFieldStyle: {
                        fontSize: "0.9rem",
                        padding: "8px 12px",
                      },
                    }}
                    title="Departments"
                  />
                </ThemeProvider>
              </Card.Body>
            </Card>
            {this.state.showEditModel ? (
              <EditDepartmentModal
                show={true}
                onHide={closeEditModel}
                data={this.state.selectedDepartment}
              />
            ) : this.state.showAlertModel ? (
              <AlertModal show={true} onHide={closeAlertModel} />
            ) : (
              <></>
            )}
          </div>
        </div>
        {this.state.hasError ? (
          <Alert variant="danger" className="m-3" block>
            {this.state.errMsg}
          </Alert>
        ) : this.state.completed ? (
          <Redirect to="/departments" />
        ) : (
          <></>
        )}
      </div>
    );
  }
}
