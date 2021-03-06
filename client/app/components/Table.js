import React, { Component, PropTypes } from 'react';
import { hidden, table } from '../styles/table.scss';
import {Link} from 'react-router-dom';

export default class Table extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const cols = this.props.columns;
        const rows = this.props.rows;

        let headers = (<thead>
            <tr>
              {cols.map((column, ci) => {
                  if (column === 'ID' && ci === 0) {
                    return <th className={hidden} key={ci}>{column}</th>;
                  }
                  return <th key={ci}>{column}</th>;
              })}
            </tr>
        </thead>);

        let body = rows.map((row, ri) => {
            let id;
            return (
                <tr key={ri}>
                {cols.map((column, ci) => {
                    let endPoint = '';
                    let ishidden = '';
                    if (column === 'ID') {
                        id = row[column];
                        ishidden = 1;
                    }
                    if (column === 'Project Name') {
                        endPoint = 'project';
                    } else if (column === 'Resource Name') {
                        endPoint = 'resource';
                    } else if (column === 'Portfolio Name') {
                        endPoint = 'portfolio';
                    }

                    if (endPoint !== '') {
                        return (
                            <td key={ci}><Link to={{pathname: `/${endPoint}/${id}`}} >{row[column]}</Link></td>
                        );
                    }

                    if (ishidden === 1) {
                        return (<td className={hidden} key={ci}>{row[column]}</td>);
                    }

                    return (<td key={ci}>{row[column]}</td>);
                })}
                </tr>
             );
             }
        );

        return (
            <table className={table}>
                {headers}
                <tbody>
                    {body}
                </tbody>
            </table>
        );
    }
}

Table.propTypes = {
    columns: PropTypes.any,
    rows: PropTypes.any
};
