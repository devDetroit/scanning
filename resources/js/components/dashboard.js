import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js/auto';

var chartGeneral = null;
var chartDay = null;

function GraphicsForm(props) {
    var chartId = "chart" + props.chartName;
    useEffect(() => {
        if (chartGeneral != null)
            chartGeneral.destroy();

        initializeGraphic()
    });

    function initializeGraphic() {
        const ctx = document.getElementById(chartId);
        chartGeneral = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Records per Station',
                    data: props.generalData,
                    backgroundColor: 'rgba(0, 81, 251, 0.6)'
                },]
            },
            options: {
                parsing: {
                    xAxisKey: 'station',
                    yAxisKey: 'totalScanned'
                }
            }
        });
    }
    return (
        <canvas id={chartId} height="105"></canvas>
    )
}

function GraphicsFormDay(props) {
    var chartId = "chart" + props.chartName;
    useEffect(() => {
        if (chartDay != null)
            chartDay.destroy();

        initializeGraphic()
    });

    function initializeGraphic() {
        const ctx = document.getElementById(chartId);
        chartDay = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Records per Station',
                    data: props.generalData,
                    backgroundColor: 'rgba( 255, 155, 111, 0.6)'
                },]
            },
            options: {
                parsing: {
                    xAxisKey: 'station',
                    yAxisKey: 'totalScanned'
                }
            }
        });
    }
    return (
        <canvas id={chartId} height="105"></canvas>
    )
}


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gnData: [], filterDate: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.getGeneralData(e.target.value);
    }
    componentDidMount() {
        this.getGeneralData()
    }

    getGeneralData(filterDate) {
        axios.get('/api/dashboard', {
            params: {
                filterDate: filterDate
            }
        })
            .then(response => {
                this.setState({
                    gnData: response.data,
                    filterDate: filterDate,
                })
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        const generalData = this.state.gnData.general;
        const dailyData = this.state.gnData.details;
        let today = this.state.filterDate ?? new Date().toISOString().slice(0, 10)

        const listItems = this.state.gnData?.general?.map((generalData, index) => <tr key={index}><th>{index + 1}</th><td>{generalData.station}</td><td>{generalData.totalScanned
        }</td></tr>) ?? [];

        const listItemsDaily = this.state.gnData?.details?.map((daily, index) => <tr key={index}><th>{index + 1}</th><td>{daily.station}</td><td>{daily.totalScanned
        }</td></tr>) ?? [];

        const listItemsRepeted = this.state.gnData?.groupData?.map((repeted, index) => <tr key={index}><th>{index + 1}</th><td>{repeted.label}</td><td>{repeted.totalItemFounds
        }</td></tr>) ?? [];

        const listItemsRepetedByDate = this.state.gnData?.groupDataByDate?.map((groupDataByDate, index) => <tr key={index}><th>{index + 1}</th><td>{groupDataByDate.label}</td><td>{groupDataByDate.totalItemFounds
        }</td></tr>) ?? [];
        return (
            <div className='container-fluid'>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <h4 className="m-4">General Summary</h4>
                        <GraphicsForm chartName={'generalChart'} generalData={generalData}></GraphicsForm>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="m-4">Daily Summary - {today}</h5>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htm="dateFilter" className="form-label">Filter by date</label>
                                    <input type="date" onChange={this.handleChange} className="form-control form-control-sm" id="dateFilter" />
                                </div>
                            </div>
                        </div>
                        <GraphicsFormDay chartName={'dailyChart'} generalData={dailyData}></GraphicsFormDay>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total scanned labels</h5>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Station</th>
                                            <th scope="col">Total scanned labels</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listItems}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total daily labels</h5>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Station</th>
                                            <th scope="col">Total scanned labels</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listItemsDaily}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">tracking number repeated</h5>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">tracking number</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listItemsRepeted}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">tracking number repeated - {today}</h5>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">tracking number</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listItemsRepetedByDate}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
/* function DashboardForm() {

    const [generalData, setGeneralData] = useState([]);


    useEffect(() => {
        getGeneralData()
    });

    function getGeneralData() {
        axios.get('/api/dashboard/general')
            .then(function (response) {
                setGeneralData(response.data)
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    return (
      
    )
} */
export default dashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}
