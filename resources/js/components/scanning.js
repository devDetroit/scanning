import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TabulatorFull as Tabulator } from 'tabulator-tables';


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
            <div className="col-md-10">
                <CardLayout title="History Records">
                    <div id="records"></div>
                </CardLayout>
            </div>
        </div>
    )
}

function ScanningForm() {
    const [data, setData] = useState([]);

    const [update, setUpdate] = useState([]);
    useEffect(() => {
        initializeTable();
        console.log('effect update')
    }, update);


    var table = null;

    function handleSubmit(e) {
        e.preventDefault();
        var input = document.forms.scanningForm.scanningInput.value
        if (input.trim().length <= 0) {
            Swal.fire({
                title: 'Error!',
                text: 'Empty scanning field',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            cleanForm();
            scanning.focus();
            return;
        }

        var getForm = document.querySelector('#scanningForm');
        var formData = new FormData(getForm);

        axios({
            method: "post",
            url: "/home",
            data: formData,
        })
            .then(function (response) {
                var today = new Date().toLocaleString();
                table.addData([{ label: scanningInput.value, station: StationDescriptionInput.value, created_at: today, user: userID.value }], true);
                cleanForm();
                scanning.focus();
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data?.errors?.scanning[0] ?? 'Something went wrong, please contact IT',
                    icon: 'error',
                    confirmButtonText: 'Confirm!'
                })
                cleanForm();
                scanning.focus();
            });


    }

    function initializeTable() {
        table = new Tabulator("#records", {
            height: 500, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
            layout: "fitColumns", //fit columns to width of table (optional)
            ajaxURL: "/show",
            columns: [ //Define Table Columns
                { title: "Label", field: "label", },
                { title: "Station", field: "station", },
                { title: "Date", field: "created_at", },
                { title: "User", field: "user" },
            ],
        });
    }

    function cleanForm() {
        document.forms['scanningForm'].reset();
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <CardLayout title={"Scanning Inventory - " + StationDescriptionInput.value}>
                        <form name='scanningForm' id='scanningForm' onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label htmlFor="scanning" className="col-md-4 col-form-label text-md-end">Scanning Number:</label>
                                <div className="col-md-6">
                                    <input id="scanningInput" type="text" className="form-control" name="scanning" required autoComplete="scanning" autoFocus />
                                </div>
                            </div>
                        </form>
                    </CardLayout>
                </div>
            </div>
            <RecordsInsertedTable records={data}></RecordsInsertedTable>
        </div>
    );
}

export default scanning;

if (document.getElementById('scanning')) {
    ReactDOM.render(<ScanningForm />, document.getElementById('scanning'));
}
