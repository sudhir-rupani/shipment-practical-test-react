import React from "react";
import "./App.css";
import MainContainer from "./MainContainer";

function App() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2>List Of Data In Table Format with sorting (asc And desc ), pagination </h2>
          <MainContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
