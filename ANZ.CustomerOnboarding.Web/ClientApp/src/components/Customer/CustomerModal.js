import React from 'react';
import { customerService } from '../../services/customer.service';
import { Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { countries } from '../../helpers/country'




export default class CustomerModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedParentCustomer: {},
            name: '',
            error:'',
            customerId: '',
            address: '',
            rmName: '',
            rmAddress: '',
            country: '',
            autocompleteData: [],
            customer: {},
            show: false,
            countries: countries.unshift({ name: '', code: '' }),
            isSubmitted: false
        };

    }



    setCustomerState = (customerData) => {
        if (customerData != null) {
            this.setState({
                id: customerData.id,
                name: customerData.name,
                address: customerData.address,
                customerId: customerData.customerId,
                rmName: customerData.rmName,
                rmAddress: customerData.rmAddress,
                country: customerData.country,
                address: customerData.address,
                selectedParentCustomer: { value: customerData.parent, label: customerData.parent },
                show: true
            })
        }

    }



    closeDialog = (e) => {
        this.clearState();
        this.props.refreshSearch();
        e.preventDefault();
    }



    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    loadOptions = (inputValue, callback) => {
        customerService.searchCustomerByName(inputValue).then(
            data => {
                this.setState({ autocompleteData: [] });
                data.map((customer) => {
                    var item = { value: customer.name, label: customer.name };
                    this.state.autocompleteData.push(item);
                })
                callback(this.state.autocompleteData);
            }
        );

    };

    clearState = () => {
        this.setState({
            selectedParentCustomer: {},
            name: '',
            id: '',
            customerId: '',
            error: '',
            address: '',
            rmName: '',
            rmAddress: '',
            country: '',
            autocompleteData: [],
            customer: {},
            show: false,
            isSubmitted: false
        });
    }

    saveCustomer = (e) => {
        this.setState({ isSubmitted: true });
        e.preventDefault();
        // stop here if form is invalid
        if (!(this.state.customerId && this.state.address && this.state.rmName && this.state.rmAddress
            && this.state.address && this.state.name && this.state.country)) {
            return;
        }
        var customerData = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address,
            customerId: this.state.customerId,
            rmAddress: this.state.rmAddress,
            country: this.state.country,
            rmName: this.state.rmName,
            parent: this.state.selectedParentCustomer.value
        }

        if (customerData.id == '' || customerData.id == null) {
            customerService.addCustomer(customerData).then(
                customer => {
                    this.clearState();
                    this.props.refreshSearch();
                },
                error => {
                    this.setState({ error: error });
                }
            );
        }
        else {
            customerService.editCustomer(customerData).then(
                customer => {
                    this.clearState();
                    this.props.refreshSearch();
                },
                error => {
                    this.setState({ error: error });
                }
            );
        }
        
    }

    onSelectChange = (value) => {
        this.setState({
            selectedParentCustomer: value
        });
        console.log(this.state);
    }

    render() {
        return (
            <Modal show={this.state.show}>
                <Modal.Header>
                    <Modal.Title>{this.state.id != null ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                        <form class="form-horizontal">
                            <label class="control-label col-sm-4 ali" htmlFor="customerId">CustomerId</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.customerId ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <input type="text" className="form-control" onChange={this.handleChange} name="customerId" value={this.state.customerId} />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-sm-4" htmlFor="parent">Parent</label>
                                <div class="col-sm-5">
                                    <AsyncSelect
                                        loadOptions={this.loadOptions}
                                        onChange={this.onSelectChange}
                                        value={this.state.selectedParentCustomer}
                                    />
                                </div>
                            </div>
                            <label class="control-label col-sm-4" htmlFor="customerName">CustomerName</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.name ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.name} />
                                </div>
                            </div>
                            <label class="control-label col-sm-4" htmlFor="address">Address</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.address ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <textarea type="text" className="form-control" name="address" onChange={this.handleChange} value={this.state.address} />
                                </div>
                            </div>
                            <label class="control-label col-sm-4" htmlFor="rmName">RM Name</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.rmName ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <input type="text" className="form-control" name="rmName" onChange={this.handleChange} value={this.state.rmName} />
                                </div>
                            </div>
                            <label class="control-label col-sm-4" htmlFor="rmAddress">RM Address</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.rmAddress ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <textarea type="text" className="form-control" name="rmAddress" onChange={this.handleChange} value={this.state.rmAddress} />
                                </div>
                            </div>
                            <label class="control-label col-sm-4" htmlFor="country">Country</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.country ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <select className="form-control" value={this.state.country} onChange={(e) => this.setState({ country: e.target.value })}>
                                        {countries.map((country) => <option key={country.code} value={country.name}>{country.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={this.saveCustomer} class="btn btn-primary">Submit</button>
                        &nbsp;
                            <button onClick={this.closeDialog} class="btn btn-default">Cancel</button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

