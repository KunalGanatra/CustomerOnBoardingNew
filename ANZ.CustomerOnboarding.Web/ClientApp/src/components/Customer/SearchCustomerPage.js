import React, { Component } from 'react';
import { customerService } from '../../services/customer.service';
import BootstrapTable from 'react-bootstrap-table-next';
import CustomerModal from './CustomerModal'
import CustomerViewModal from './CustomerViewModal'
import { authenticationService } from '../../services/authentication.service';
import { Role } from '../../helpers/role'


export class SearchCustomerPage extends Component {
    displayName = SearchCustomerPage.name

    constructor(props) {
        super(props);

        //We can use state management techniques like Mobx or React
        // Since the scope is too small, it didnt make sense implementing it here.
        this.state = {
            customerData: [],
            selectedRow: {},
            currentuser: '',
            isViewOnly: false,
            isEdit: false,
            isAdmin: false,
            searchCriteria: ''
        };

    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ searchCriteria: value });
        customerService.searchCustomer(value).then(data => this.setState({ customerData: data }));;
    }

    handleOnSelect = (row, isSelect) => {
        this.setState({ selectedRow: row })

        return true;
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin,
            isEdit: x && x.role === Role.Edit,
            isViewOnly: x && x.role === Role.ViewOnly
        }));
    }

    editCustomer = (e) => {
        this.refs.child.setCustomerState(this.state.selectedRow);
        e.preventDefault();
    }


    viewCustomer = (e) => {
        this.refs.childView.viewCustomerHierarchy(this.state.selectedRow.name);
        e.preventDefault();
    }


    addCustomer = (e) => {
        this.refs.child.setCustomerState({});
        e.preventDefault();
    }

    refresh = () => {
        this.setState({ searchCriteria: '' });
        this.setState({ customerData: [] });
        this.setState({ selectedRow: {} });
    }

    render() {
        const columns = [{
            dataField: 'customerId',
            text: 'Customer ID'
        }, {
            dataField: 'name',
            text: 'Customer Name'
        },
        {
            dataField: 'parent',
            text: 'Parent'
        }, {
            dataField: 'rmName',
            text: 'RMName'
        }];



        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: this.handleOnSelect

        };

        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Search Customer</h2>
                <form name="form" className="form-horizontal pt-10">
                    <div className="form-group pt-10">
                        <label className="col-sm-2 col-form-label " htmlFor="customerSearch">Search</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" name="customerSearch" value={this.state.searchCriteria} onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        {this.state.customerData.length > 0 &&

                            <BootstrapTable keyField='id' data={this.state.customerData} columns={columns} striped selectRow={selectRow}
                            hover
                            condensed
                        />
                        }
                    </div>
                    <div className="text-right" >
                            {!this.state.isViewOnly &&
                               
                                    <button className="btn btn-primary" name="add" onClick={this.addCustomer}>Add</button>
                               
                                }
                        &nbsp;
                            {!this.state.isViewOnly &&
                                
                                    <button className="btn btn-primary" name="edit" disabled={!this.state.selectedRow.id} onClick={this.editCustomer}>Edit</button>
                               
                            }
                           &nbsp;
                                <button className="btn btn-primary" disabled={!this.state.selectedRow.id} onClick={this.viewCustomer}>View</button>
                            

                            <CustomerModal ref="child" refreshSearch={this.refresh} />
                            <CustomerViewModal ref="childView" refreshSearch={this.refresh} />
                    </div>
                </form>
            </div>

        );
    }
}
