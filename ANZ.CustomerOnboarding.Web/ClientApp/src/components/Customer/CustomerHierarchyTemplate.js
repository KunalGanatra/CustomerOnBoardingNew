

import React, { Component } from 'react';

class CustomerHierarchyTemplate extends Component {
    render() {
        return (
            <div style={{ fontSize: 'smaller', marginLeft: '5px', paddingLeft: '25px' }} >
                <b><p>Customer Name: {this.props.item.name}</p></b>
                <p >Parent Name: {this.props.item.parent}</p>
                <p>CustomerId: {this.props.item.customerId}</p>
                <p>CustomerAddress: {this.props.item.address}</p>
                <p>Country: {this.props.item.country}</p>
                <p>RMName: {this.props.item.rmName}</p>
                <p>RMAddres : {this.props.item.rmAddress}</p>
            </div>
        );
    }
}

export default CustomerHierarchyTemplate;