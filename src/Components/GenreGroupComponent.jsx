import React, { Component } from "react";

class GenresList extends Component {
  render() {
    const {
      items,
      textProperty,
      valueProperty,
      onItemSelect,
      selectedItem
    } = this.props;
    return (
      <ul className="list-group ml-5">
        {items.map(item => (
          <li
            key={item[valueProperty]}
            className={
              item === selectedItem
                ? "list-group-item active"
                : "list-group-item"
            }
            onClick={() => onItemSelect(item)}
          >
            {item[textProperty]}
          </li>
        ))}
      </ul>
    );
  }
}

GenresList.defaultProps = {
  textProperty: "name",
  valueProperty: "_id"
};

export default GenresList;
