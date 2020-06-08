import React, { Component } from "react";
import axios from "axios";
import Thead from "../component/Thead";
import Tbody from "../component/Tbody";
import Pagination from "../component/Pagination";
// import { sortDataByKey } from "../util/utils";
const _ = require("underscore");

const ASC = "asc";
const DESC = "desc";

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipmentDetail: [],
      activePage: 1,
      totalPage: 0,
      limitPerPage: 5,
      tableHeaders: [
        "id",
        "userId",
        "name",
        "mode",
        "cargo",
        "services",
        "type",
        "origin",
        "destination",
        "total",
        "status",
      ],
      sortColName: "id",
      sortOrder:ASC,
      shipmentData: [],
      isShipmentDataLoaded: false,
      singlePageData: [],
      isPaginationDataLoaded: false,
    };
    this.handleSortClick = this.handleSortClick.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleLimitDataPerPage = this.handleLimitDataPerPage.bind(this);
  }

   componentDidMount() {
     axios.get(`http://localhost:3004/shipments`).then((response) => {
      console.log(response);

      this.setState(
        {
          shipmentData: response.data,
          isShipmentDataLoaded: true,
        },
        () => {
          this.intPagination();
        }
      );
    });
  }

  intPagination() {
    const limitPerPage = this.state.limitPerPage;
    const totalPage = this.countTotalPages(limitPerPage);
    let pdata = [];
    if (this.state.isShipmentDataLoaded) {
      for (let i = 0; i < limitPerPage; i++) {
        pdata.push(this.state.shipmentData[i]);
      }
      this.setState({
        isPaginationDataLoaded: true,
        singlePageData: pdata,
        totalPage,
      });
    }
  }

  handleSortClick(sortColName) {
    // console.log(sortColName);
    // console.log(this.state.sortColName);
    let sortOrder = "";
    const shipmentData = this.state.shipmentData;
    let data;
    if (sortColName !== this.state.sortColName) {
      sortOrder = ASC;
      data = _.sortBy(shipmentData, sortColName);
    } else {
      sortOrder = this.state.sortOrder === ASC ? DESC : ASC;
      data =
        this.state.sortOrder === ASC
          ? _.sortBy(shipmentData, sortColName).reverse()
          : _.sortBy(shipmentData, sortColName);
    }
    this.setState(
      {
        sortColName,
        sortOrder,
        shipmentData: data,
      },
      () => {
        this.intPagination();
      }
    );
  }

  handleLimitDataPerPage(event) {
    const value = event.target.value;
    this.setState({ limitPerPage: value }, () => {
      this.intPagination();
    });
  }

  countTotalPages(limitPerPage) {
    return Math.ceil(this.state.shipmentData.length / limitPerPage);
  }
  handlePagination(pageNumber) {
    const limitPerPage = this.state.limitPerPage;
    const start = (pageNumber - 1) * limitPerPage;
    const end = pageNumber * limitPerPage;
    let pData = [];
    for (let i = start; i < end; i++) {
      if (this.state.shipmentData[i] === undefined) {
        break;
      }
      pData.push(this.state.shipmentData[i]);
    }
    this.setState({
      singlePageData: pData,
      activePage: pageNumber,
    });
    console.log(pData);
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <Thead
            data={this.state.tableHeaders}
            handleSortClick={this.handleSortClick}
            sortOrder={this.state.sortOrder}
          />
          <Tbody
            data={this.state.singlePageData}
            headerData={this.state.tableHeaders}
          />
        </table>
        {this.state.isPaginationDataLoaded && (
          <Pagination
            handlePagination={this.handlePagination}
            numberOfPages={this.state.totalPage}
            limitPerPage={this.state.limitPerPage}
            currentPage={this.state.activePage}
            handleLimitDataPerPage={this.handleLimitDataPerPage}
          />
        )}
      </div>
    );
  }
}

export default MainContainer;
