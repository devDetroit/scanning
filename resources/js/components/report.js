import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TabulatorFull as Tabulator } from 'tabulator-tables';

var table = null;
function CardLayout(props) {
    return (
        <div className="card">
            <div className="card-header"><strong>{props.title}</strong></div>
            <div className="card-body">
                {props.children}
            </div>
        </div>
    )
}

function RecordsInsertedTable() {
    return (
        <div className="row justify-content-center mt-4">
            <div className="col-md-12">
                <div id="records"></div>
            </div>
        </div>
    )
}

function SelectStations(props) {
    var listItems = null;
    if (props.optionStations.length > 0) {
        listItems = props.optionStations.map((station) => <option value={station.id} key={station.id}>{station.station}</option>);
    }
    return (
        <select className="form-select" id="station_id" name="station_id" >
            <option defaultValue={"All"}>All</option>
            {listItems}
        </select>
    )
}

function ScanningForm() {
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState([]);

    useEffect(() => {
        getStations();
        initializeTable();
    }, update);

    function getStations() {
        axios.get('/api/stations')
            .then(function (response) {
                setData(response.data);
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    function downloadExcel() {
        table.download("csv", "scanning.csv");
    }

    function handleSubmit(e) {
        e.preventDefault();
        table.setData("api/report/filter", {
            fromDate: document.forms.report.fromDate.value, toDate: document.forms.report.toDate.value, station_id: document.forms.report.station_id.value
        });
    }

    function initializeTable() {
        table = new Tabulator("#records", {
            height: 600, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
            layout: "fitColumns", //fit columns to width of table (optional)
            columns: [ //Define Table Columns
                { title: "Label", field: "label" },
                { title: "Station", field: "station", },
                { title: "Date", field: "created_at", },
                { title: "User", field: "user" },
            ],
        });

        table.on("tableBuilt", () => {
            table.setData("api/report/filter");
        });

    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <CardLayout title={"Scanning Inventory Report"}>
                        <form name="report" className="row gy-2 gx-3 align-items-center" onSubmit={handleSubmit}>
                            <div className="col-auto">
                                <label className="visually-hidden" htmlFor="formDate">Name</label>
                                <input type="date" className="form-control" id="formDate" name="fromDate" placeholder="From Date" required />
                            </div>
                            <div className="col-auto">
                                <label className="visually-hidden" htmlFor="autoSizingInput">Name</label>
                                <input type="date" className="form-control" id="toDate" name='toDate' placeholder="To Date" required />
                            </div>
                            <div className="col-md-4">
                                <label className="visually-hidden" htmlFor="autoSizingSelect">Preference</label>
                                <SelectStations optionStations={data}></SelectStations>
                            </div>
                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary">Search</button>
                                <button type="reset" className="btn btn-warning">Clear</button>
                                <button type="button" className="btn btn-dark" onClick={downloadExcel}>Download CSV</button>
                            </div>
                        </form>
                    </CardLayout>
                </div>
            </div>
            <RecordsInsertedTable records={data}></RecordsInsertedTable>
        </div >
    );
}

export default report;

if (document.getElementById('report')) {
    ReactDOM.render(<ScanningForm />, document.getElementById('report'));
}
