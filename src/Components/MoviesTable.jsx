import React, { Component } from "react";
import Like from "./Common/LikeComponent";
import Table from "./Common/Table";
import { Link } from "react-router-dom";

class MoviesTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: movie => <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      label: "Like",
      content: movie => (
        <Like liked={movie.isLike} onClick={() => this.props.onLike(movie)} />
      )
    },
    {
      key: "delete",
      content: movie => (
        <button
          className="btn btn-danger"
          style={{ marginLeft: 1 + "rem" }}
          onClick={() => this.props.onDeleteMovie(movie)}
        >
          delete
        </button>
      )
    }
  ];

  handleSearchChange = ({ currentTarget: input }) => {
    const inputText = input.value.toUpperCase();
    this.props.onInputSearch(inputText);
  };

  render() {
    const { filteredMovies, onSort, sortColumn } = this.props;
    // if (filteredMovies.length === 0) {
    //   return <p>There are no movies in database.</p>;
    // }

    if (!this.props.user) this.columns[this.columns.length - 1].content = null;

    return (
      <React.Fragment>
        <p>Showing {filteredMovies.length} movies in the databasse.</p>
        <Table
          columns={this.columns}
          data={filteredMovies}
          sortColumn={sortColumn}
          onSort={onSort}
        />
      </React.Fragment>
    );
  }
}

export default MoviesTable;
