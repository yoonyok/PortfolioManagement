import React from 'react';
import Table from './Table.js';
import { resource } from '../styles/resource.scss';
import axios from 'axios';


class ResourceDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
        };

        this.getDetails = this.getDetails.bind(this);
    }

    componentDidMount() {
        this.getDetails();
    }

    // TODO: need to fix up the apiary call
    getDetails() {
        console.log('in getdetails');
        axios.get('https://private-05c14-methanex.apiary-mock.com/resource/1').then(response => {
            const rows = [];
            const data = response.data;
            console.log(response.data);
            for (const key in data) {
                if(key !== null) {
                    rows.push({'key': key, 'value': data[key]});
                }
            }
            console.log(data);
            this.setState({rows: rows});
        }).catch( () => {
        });
    }

    render() {
        let columns = ['key', 'value'];
        return (
            <div className={ resource }>
                <h1>Resource Details</h1>
                <Table text="Resource Details" columns={columns} rows={this.state.rows}/>
            </div>
        );
    }

}

export default ResourceDetail;
