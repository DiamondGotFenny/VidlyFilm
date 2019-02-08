import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class Pagination extends Component {
  render() {
    const { totalItemsNum, pageSize, onPageChange, currentPage } = this.props;
    const pagesCount = Math.ceil(totalItemsNum / pageSize);
    if (pagesCount === 1) {
      return null;
    }
    const pages = _.range(1, pagesCount + 1);
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a
              className="page-link"
              onClick={() => {
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {pages.map(page => (
            <li
              key={page}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <a className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </a>
            </li>
          ))}

          <li className="page-item">
            <a
              className="page-link"
              onClick={() =>
                currentPage + 1 <= pagesCount
                  ? onPageChange(currentPage + 1)
                  : null
              }
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  totalItemsNum: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default Pagination;
