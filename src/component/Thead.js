import React from "react";

export default function Thead(props) {
  const tableHeaders = props.data
  return (
    <thead>
      <tr>
        {tableHeaders.map((el) => {
         // console.log(el);
          if (el.length === 0) {
            return <th key={0} />;
          }
          return (
            <th
              className={"sortable " }
              onClick={() => props.handleSortClick(el)}
              key={el}
            >
              {el}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
