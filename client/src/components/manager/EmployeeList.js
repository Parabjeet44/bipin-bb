import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class EmployeeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      selectedUser: null,
      viewRedirect: false,
      viewSalaryRedirect: false,
      editRedirect: false,
      deleteModal: false,
    };
  }

  componentDidMount() {
    let deptId = JSON.parse(localStorage.getItem("user")).departmentId;
    axios({
      method: "get",
      url: "/api/users/department/" + deptId,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ users: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onView = (user) => {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedUser: user, viewRedirect: true });
    };
  };

  onSalaryView = (user) => {
    return (event) => {
      event.preventDefault();

      this.setState({
        selectedUser: { user: { id: user.id } },
        viewSalaryRedirect: true,
      });
    };
  };

  render() {
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
      <div className="container-fluid pt-4">
        {this.state.viewRedirect ? (
          <Redirect
            to={{
              pathname: "/employee-view",
              state: { selectedUser: this.state.selectedUser },
            }}
          ></Redirect>
        ) : (
          <></>
        )}
        {this.state.viewSalaryRedirect ? (
          <Redirect
            to={{
              pathname: "/salary-view",
              state: { selectedUser: this.state.selectedUser },
            }}
          ></Redirect>
        ) : (
          <></>
        )}
        <div className="col-sm-12">
          <Card className="main-card">
            <Card.Header>
              <div className="panel-title">
                <strong>Employee List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "EMP ID", field: "id" },
                    { title: "Full Name", field: "fullName" },
                    { title: "Department", field: "department.departmentName" },
                    {
                      title: "Job Title",
                      field: "jobs",
                      render: (rowData) =>
                        rowData.jobs.map((job, index) => {
                          if (
                            new Date(job.startDate).setHours(0) <= Date.now() &&
                            new Date(job.endDate).setHours(24) >= Date.now()
                          ) {
                            return job.jobTitle;
                          }
                        }),
                    },
                    { title: "Mobile", field: "user_personal_info.mobile" },
                    {
                      title: "Status",
                      field: "active",
                      render: (rowData) =>
                        rowData.active ? (
                          <Badge pill variant="success">
                            Active
                          </Badge>
                        ) : (
                          <Badge pill variant="danger">
                            Inactive
                          </Badge>
                        ),
                    },
                    {
                      title: "View",
                      headerStyle: { textAlign: "right" },
                      cellStyle: { textAlign: "right" },
                      render: (rowData) => (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            size="sm"
                            variant="info"
                            onClick={this.onView(rowData)}
                            title="View Profile"
                          >
                            <i className="far fa-address-card"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={this.onSalaryView(rowData)}
                            title="View Salary"
                          >
                            <i className="fas fa-hand-holding-usd"></i>
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  data={this.state.users}
                  options={{
                    rowStyle: {
                      transition: "background-color 0.2s",
                    },
                    headStyle: {
                      backgroundColor: "#f8fafc",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                    actionsColumnIndex: -1,
                  }}
                  title="Employees"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
