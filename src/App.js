import React, { Component } from "react";
import Movies from "./Components/Movies";
import Customers from "./Components/customers";
import Rendals from "./Components/rentals";
import NavBar from "./Components/Common/navBar";
import { Route, Redirect, Switch } from "react-router-dom";
import NoFound from "./Components/no-found";
import MovieForm from "./Components/movieForm";
import LoginForm from "./Components/loginForm";
import Logout from "./Components/logoutComponent";
import Register from "./Components/RegisterForm";
import ProtectedRoute from "./Components/Common/protectedRoute";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "./services/authService";

class App extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    return (
      <div>
        <ToastContainer />
        <NavBar user={this.state.user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/movies/:_id" component={MovieForm} />
            <Route
              path="/movies"
              render={props => <Movies {...props} user={this.state.user} />}
            />
            <Route path="/customers" component={Customers} />
            <Route path="/rentals" component={Rendals} />
            <Route path="/no-found" component={NoFound} />
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/no-found" />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
