import React from "react";
import Joi from "joi-browser";
import { getMovie, saveMovie } from "./../services/moviesService";
import { getGenres } from "./../services/genreService";
import Form from "./Common/formComponent";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: ""
    },
    genres: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .label("Title")
      .required(),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .label("Number In Stock")
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .label("Rate")
      .required()
  };

  async pupulateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async pupulateMovie() {
    try {
      const movieId = this.props.match.params._id;
      if (movieId === "new") {
        return;
      }
      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewMode(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        return this.props.history.replace("/NoFound");
      }
    }
  }
  async componentDidMount() {
    await this.pupulateGenres();
    await this.pupulateMovie();
  }

  mapToViewMode(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    };
  }

  doSubmit = async () => {
    //call the server
    await saveMovie(this.state.data);
    this.props.history.push("/movies");
  };

  render() {
    return (
      <div className="m-4">
        <h1>Movie Form {this.state.data.title}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.SelectGenreOpt("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number in Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate", "number")}
          {this.renderSubmitBtn("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
