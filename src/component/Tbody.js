import React from "react";

export default function Tbody(props) {
  const tabledata = props.data;
  const headerData = props.headerData;

  return (
    <tbody>
      {tabledata.map((el) => {
        let rowData = el;
        return (
          <tr key={rowData.id}>
            {headerData.map((ob, index) => {
              let isArray = Array.isArray(rowData[ob]);
              return (
                <td key={index}>
                  {isArray ? <SubData headerKey ={ob} data={rowData[ob]} /> : rowData[ob]}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
export function SubData(props) {
  return props.data.map((ob, index) => {
    const entries = Object.entries(ob);
    const subDetails = [];

    for (let i = 0; i < entries.length; i += 1) {
      const [key, value] = entries[i];
      subDetails.push(
        <div key={key} className={`${props.headerKey}__data ` }>
          <span>
            <b>{`${key.toUpperCase()}`}</b>
            {` : ${value}`}
          </span>
        </div>
      );
    }
    return <div className={`${props.headerKey}` } key={index}>{subDetails}</div>;
  });
}
