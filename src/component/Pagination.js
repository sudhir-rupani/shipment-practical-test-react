import React from "react";

export default function Pagination(props) {
  const pages = [];
  const perpage = [5, 10, 15, 20];
  for (let i = 1; i <= props.numberOfPages; i += 1) {
    pages.push(
      <li
        className={`page-item ${props.currentPage === i ? "active" : ""}`}
        key={`pageNumber${i}`}
      >
        <a
          className="page-link"
          onClick={(e) => props.handlePagination(i)}
          role="button"
        >
          {i}
        </a>
      </li>
    );
  }
  return (
    <div>
      <nav aria-label="...">
        <ul className="pagination  ">{pages}</ul>
        <select
          onChange={(e) => props.handleLimitDataPerPage(e)}
          defaultValue={props.limitPerPage}
          className="form-control"
        >
          {perpage.map((el, index) => {
            return (
              <option key={index} value={el}>
                {el}
              </option>
            );
          })}
        </select>
      </nav>
    </div>
  );
}
