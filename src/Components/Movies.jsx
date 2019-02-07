import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/moviesService";
import { getGenres } from "../services/genreService";
import Pagination from "./Common/PaginationComponent";
import { paginate } from "./Utility/Paginate";
import GenresList from "./GenreGroupComponent";
import MoviesTable from "./MoviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBoxe from "./Common/searchBox";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4, //how many items in each page
    currentPage: 1, //default active page is 1
    sortColumn: { path: "title", order: "asc" }, // sort the movies by title, the order is ascend
    searchQuery: "",
    seletedGenre: null
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();

    this.setState({ movies, genres });
  }

  handleLike = movie => {
    let moviesArr = [...this.state.movies]; // make a separate copy of the array
    let index = this.state.movies.indexOf(movie);
    moviesArr[index] = { ...movie };
    if (index !== -1) {
      moviesArr[index].isLike = !movie.isLike;
      this.setState({ movies: moviesArr });
    }
  };

  handleDelete = async movie => {
    /**************this block don't delete movie from the actual database */
    // let moviesArr = [...this.state.movies]; // make a separate copy of the array
    // let index = this.state.movies.indexOf(movie);
    // if (index !== -1) {
    //   moviesArr.splice(index, 1);
    //   this.setState({ movies: moviesArr });
    // }

    //Mosh's solution
    // const movies = this.state.movies.filter(m => m._id !== movie._id); //a new array that
    // doesn't include deleted movie
    // this.setState({ movies:movies });
    /*************************** */
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This Movie has been deleted!");
      }
      this.setState({ movies: originalMovies });
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    delete this.state.searchFiltered;
    this.setState({ seletedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, seletedGenre: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      movies,
      currentPage,
      pageSize,
      seletedGenre,
      sortColumn,
      searchQuery
    } = this.state;
    //filled the movies by genre

    // const filtered =
    //   seletedGenre && seletedGenre._id
    //     ? movies.filter(m => m.genre._id === seletedGenre._id)
    //     : movies;

    let filtered = movies;
    if (seletedGenre && seletedGenre._id) {
      filtered = movies.filter(m => m.genre._id === seletedGenre._id);
    } else if (searchQuery) {
      filtered = movies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    //sort the movies array by title, ascending order
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    //pass the sorted movies list to paginate for paginating.
    const moviesList = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, moviesList };
  };

  render() {
    const {
      movies,
      currentPage,
      pageSize,
      seletedGenre,
      genres,
      sortColumn,
      searchQuery
    } = this.state;

    const { totalCount, moviesList } = this.getPageData();
    const { user } = this.props;
    return (
      <div className="row mt-4">
        <div className="col-3">
          <GenresList
            items={genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={seletedGenre}
          />
          {user && (
            <Link to="movies/new" className="btn btn-primary m-5">
              New Movie
            </Link>
          )}
        </div>
        <div className="col">
          <main className="container ">
            <SearchBoxe value={searchQuery} onChange={this.handleSearch} />
            <MoviesTable
              filteredMovies={moviesList}
              onDeleteMovie={this.handleDelete}
              movies={movies}
              onLike={this.handleLike}
              onSort={this.handleSort}
              sortColumn={sortColumn}
              user={user}
            />
            <Pagination
              totalItemsNum={totalCount}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
              currentPage={currentPage}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default Movies;
