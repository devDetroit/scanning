import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js/auto';

function GraphicsForm(props) {
    //var data = [{ "totalScanned": 28, "station": "Station 1" }, { "totalScanned": 4, "station": "Station 2" }, { "totalScanned": 1, "station": "Station 3" }];
    var chartId = "chart" + props.chartName;
    useEffect(() => {
        console.log('entro a la grafica')
    });

    function initializeGraphic() {
        const ctx = document.getElementById(chartId);
        chartGeneral = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Records per User',
                    data: props.data,
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


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gnData: [], dilyDate: [] };
    }

    componentDidMount() {
        this.getGeneralData()
    }

    getGeneralData() {
        axios.get('/api/dashboard/general')
            .then(response => {
                this.setState({
                    gnData: response.data
                })
            })
            .catch(error => {
                console.error(error);
            })
    }

    getSpecificData() {
        axios.get('/api/dashboard/general')
            .then(response => {
                this.setState({
                    gnData: response.data
                })
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        console.log(this.state.gnData)
        return (
            <div className='container-fluid'>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <h4 className="m-4">General Summary</h4>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="m-4">Daily Summary</h5>
                                <GraphicsForm chartName={'generalChart'}></GraphicsForm>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htm="dateFilter" className="form-label">Filter by date</label>
                                    <input type="date" className="form-control form-control-sm" id="dateFilter" />
                                </div>
                            </div>
                        </div>
                        <canvas id="myChart2" height="105"></canvas>
                    </div>
                </div>
            </div>
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
