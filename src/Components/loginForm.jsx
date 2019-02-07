import React from "react";
import Joi from "joi-browser";
import Form from "./Common/formComponent";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  state = {
    data: {
      username: "",
      password: ""
    },

    errors: {}
  };

  schema = {
    username: Joi.string()
      .email({ minDomainAtoms: 2 })
      .label("Username")
      .required(),
    password: Joi.string()
      .min(5)
      .label("Password")
      .required()
  };

  doSubmit = async () => {
    //call the server
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderSubmitBtn("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
