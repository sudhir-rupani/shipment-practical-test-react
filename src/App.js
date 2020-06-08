import React, { Component } from "react";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shipment_search: "",
      searchType: "number",
      searchBy: "id",
      searchPlaceHolder: "Search Shipment By ID",
      shipmentData: [],
      toFilterShipmentData: [],
      isShipmentDataLoaded: false,
      filteredDataLength: "",
      paginationData: [],
      paginationLinks: [],
      isPaginationDataLoaded: false,
    };

    this.shipmentSearch = this.shipmentSearch.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.selectSearchType = this.selectSearchType.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
  }
  async componentDidMount() {
    await this.loadShipments();
    this.pagination();
  }

  loadShipments() {
    return new Promise((resolve, reject) => {
      fetch("http://localhost:3000/shipments")
        .then((j) => j.json())
        .then((data) => {
          console.log(data);
          this.setState({
            shipmentData: data,
            toFilterShipmentData: data,
            isShipmentDataLoaded: true,
            filteredDataLength: data.length,
          });
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  }

  shipmentSearch(event) {
    let filteredData = this.state.paginationData.filter((shipment, idx) => {
      let reg = new RegExp(event.target.value, "gi");
      if (this.state.searchBy === "id") {
        return reg.test(shipment.id);
      } else if (this.state.searchBy === "name") {
        return reg.test(shipment.name);
      } else if (this.state.searchBy === "status") {
        return reg.test(shipment.status);
      }
      return 0;
    });

    this.setState({
      [event.target.name]: event.target.value,
      paginationData: filteredData,
      filteredDataLength: filteredData.length,
    });
  }

  selectSearchType(event) {
    if (event.target.value === "id") {
      this.setState({
        searchBy: "id",
        searchPlaceHolder: "Search Shipment By ID",
        searchType: "number",
      });
    } else if (event.target.value === "name") {
      this.setState({
        searchBy: "name",
        searchPlaceHolder: "Search Shipment By NAME",
        searchType: "text",
      });
    } else if (event.target.value === "status") {
      this.setState({
        searchBy: "status",
        searchPlaceHolder: "Search Shipment By STATUS",
        searchType: "text",
      });
    }
  }

  sortBy(event) {
    if (event.target.value === "id_asc") {
      const data = this.state.paginationData.sort(
        (a, b) =>
          parseInt(a.id.replace("S", "")) - parseInt(b.id.replace("S", ""))
      );
      this.setState({
        paginationData: data,
      });
    } else if (event.target.value === "id_des") {
      const data = this.state.paginationData.sort(
        (a, b) =>
          parseInt(b.id.replace("S", "")) - parseInt(a.id.replace("S", ""))
      );
      this.setState({
        paginationData: data,
      });
    } else if (event.target.value === "name_asc") {
      const data = this.state.paginationData.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
      this.setState({
        paginationData: data,
      });
    } else if (event.target.value === "name_des") {
      const data = this.state.paginationData.sort((a, b) =>
        a.name < b.name ? 1 : -1
      );
      this.setState({
        paginationData: data,
      });
    }
  }

  pagination() {
    let links = [];
    let offset = 20;
    let pdata = [];
    if (this.state.isShipmentDataLoaded) {
      const len = Math.ceil(this.state.shipmentData.length / offset);
      for (let i = 0; i < len; i++) {
        links.push(
          <button
            onClick={this.handlePagination}
            id={i + 1}
            key={i + 1}
            data-offset-start={i * 20}
            data-offset-end={(i + 1) * 20}
          >
            {" "}
            {i + 1}
          </button>
        );
      }

      for (let i = 0; i < this.state.shipmentData.length; i++) {
        if (i === 20) {
          break;
        }
        pdata.push(this.state.shipmentData[i]);
      }
      this.setState({
        isPaginationDataLoaded: true,
        paginationData: pdata,
        paginationLinks: links,
      });
    }
  }

  handlePagination(event) {
    const start = event.target.getAttribute("data-offset-start");
    const end = event.target.getAttribute("data-offset-end");
    let pData = [];
    for (let i = start; i < end; i++) {
      if (this.state.shipmentData[i] === undefined) {
        break;
      }
      pData.push(this.state.shipmentData[i]);
    }
    this.setState({
      paginationData: pData,
    });
  }

  render() {
    return (
      <>
        <div className="container">
          <div className="row shipment-sec">
            <div className="col-sm-12 col-md-4 col-lg-4 res-sec">
              <div className="ship-head">
                Shipments {this.state.filteredDataLength}
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 res-sec">
              <div className="ship-sort">
                <select onChange={this.sortBy}>
                  <option disabled>Sort By</option>
                  <option value="id_asc" defaultValue>
                    ID (ASC)
                  </option>
                  <option value="id_des">ID (DEC)</option>
                  <option value="name_asc">Name (ASC)</option>
                  <option value="name_des">Name (DEC)</option>
                </select>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 res-sec">
              <div className="ship-search">
                {this.state.searchBy === "id" ? <div>S</div> : ""}
                <input
                  type={this.state.searchType}
                  placeholder={this.state.searchPlaceHolder}
                  name="shipment_search"
                  value={this.state.shipment_search}
                  onChange={this.shipmentSearch}
                />
                <select onChange={this.selectSearchType}>
                  <option value="id">ID</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            {this.state.isPaginationDataLoaded ? (
              <div className="col-12 all-shipments">
                <div className="row">
                  {this.state.paginationData.map((shipment) => {
                    return (
                      <div
                        className="col-sm-12 col-md-4 col-lg-3"
                        key={shipment.id}
                        id={shipment.id}
                      >
                        <div className="shipment-item">
                          <div className="name">{shipment.name}</div>
                          <div className="origin">{shipment.origin}</div>
                          <div className="status">{shipment.status}</div>
                          <div className="si-foot">
                            <div className="id">{shipment.id}</div>
                            <div className="type">{shipment.type}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="col-12">
                <div className="loader">
                  <img
                    src="https://the-box.fr/images/loading.gif?h=c9793c73"
                    alt="loader"
                  />
                  Loading Shipment Data...
                </div>
              </div>
            )}
            <div className="col-12">
              <div className="pagination">
                {this.state.paginationLinks.map((link) => {
                  return link;
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
