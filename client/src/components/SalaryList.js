import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import DeleteModal from "./DeleteModal";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class SalaryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      financialInformations: [],
      selectedUser: null,
      editRedirect: false,
      deleteModal: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/financialInformations",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ financialInformations: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onEdit = (financialInfo) => {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedUser: financialInfo.user, editRedirect: true });
    };
  };

  onView = (user) => {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedUser: user, viewRedirect: true });
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
        {this.state.editRedirect ? (
          <Redirect
            to={{
              pathname: "/salary-details",
              state: { selectedUser: this.state.selectedUser },
            }}
          ></Redirect>
        ) : (
          <></>
        )}
        {this.state.viewRedirect ? (
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
                <strong>List of Employees and Their Salaries</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "EMP ID", field: "user.id" },
                    { title: "Full Name", field: "user.fullName" },
                    { title: "Gross Salary", field: "salaryGross" },
                    { title: "Deductions", field: "deductionTotal" },
                    { title: "Net Salary", field: "salaryNet" },
                    { title: "Emp Type", field: "employmentType" },
                    {
                      title: "View",
                      render: (rowData) => (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={this.onView(rowData)}
                            title="View Profile"
                          >
                            <i className="far fa-address-card"></i>
                          </Button>
                        </div>
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
                          }}
                        >
                          <Button
                            size="sm"
                            variant="info"
                            onClick={this.onEdit(rowData)}
                          >
                            <i className="far fa-edit mr-1"></i>Edit
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  data={this.state.financialInformations}
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
