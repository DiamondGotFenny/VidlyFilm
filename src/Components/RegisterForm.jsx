import React from "react";
import Joi from "joi-browser";
import Form from "./Common/formComponent";
import * as userService from "../services/userService";
import auth from "../services/authService";

class Register extends Form {
  state = {
    data: {
      username: "",
      password: "",
      name: ""
    },

    errors: {}
  };

  schema = {
    username: Joi.string()
      .email({ minDomainAtoms: 2 })
      .label("Username"),
    password: Joi.string()
      .min(5)
      .label("Password"),
    name: Joi.string()
      .required()
      .label("Name")
  };

  doSubmit = async () => {
    //call the server
    try {
      const response = await userService.register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        console.log("errors", errors);
        errors.username = ex.response.data;
        console.log(ex.response);
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderSubmitBtn("Register")}
        </form>
      </div>
    );
  }
}

export default Register;
