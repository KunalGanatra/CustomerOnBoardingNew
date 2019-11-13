import React from 'react';
import { adminService } from '../../services/admin.service';
import { Modal } from 'react-bootstrap';



export default class AdminModal extends React.Component {

    constructor(props) {
        super(props);

        ///In Ideal scenario the username & password is set by the user
        //hence only role & the details of the person can be changed by the admin.
        this.state = {
            name: '',
            firstName: '',
            lastName: '',
            username: '',
            role: '',
            id: '',
            error: '',
            show: false,
            isSubmitted: false
        };

    }

    setUserState = (userData) => {
        if (userData != null) {
            this.setState({
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                role: userData.role,
                id: userData.id,
                show: true
            })
        }

    }




    closeDialog = (e) => {
        this.clearState();
        this.props.refreshSearch();

    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }


    saveUser = (e) => {
        this.setState({ isSubmitted: true });
        e.preventDefault();
        // stop here if form is invalid
        if (!(this.state.firstName && this.state.lastName && this.state.role
            && this.state.username)) {
            return;
        }
        var userData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            role: this.state.role,
            id: this.state.id,
            username: this.state.username
        }

        if (userData.id == '' || userData.id == null) {
            adminService.addUser(userData).then(
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
            adminService.editUser(userData).then(
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

    clearState = () => {
        this.setState({
            name: '',
            firstName: '',
            lastName: '',
            role: '',
            error: '',
            userName: '',
            show: false,
            isSubmitted: false
        });
    }
    render() {
        const props = this.props;
        return (

            <Modal show={this.state.show} >
                <Modal.Header>
                    <Modal.Title>{this.state.id != null ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                        <form class="form-horizontal">
                            <label class="control-label col-sm-4 justify-content-left" htmlFor="firstName">FirstName</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.firstName ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <input type="text" className="form-control" onChange={this.handleChange} name="firstName" value={this.state.firstName} />
                                </div>
                            </div>
                            <label class="control-label col-sm-4 justify-content-left" htmlFor="lastName">LastName</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.lastName ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <input type="text" className="form-control" onChange={this.handleChange} name="lastName" value={this.state.lastName} />
                                </div>
                            </div>
                            {
                                //userName can only be added.
                                this.state.id == null &&
                                <div >
                                    <label class="control-label col-sm-4 justify-content-left" htmlFor="username">UserName</label>
                                    <div className={'form-group' + (this.state.isSubmitted && !this.state.username ? ' has-error' : '')}>
                                        <div class="col-sm-5">
                                            <input type="text" className="form-control" onChange={this.handleChange} name="username" value={this.state.username} />
                                        </div>
                                    </div>
                                </div>
                            }
                            <label class="control-label col-sm-4 justify-content-left" htmlFor="role">Role</label>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.role ? ' has-error' : '')}>
                                <div class="col-sm-5">
                                    <select className="form-control" value={this.state.role} name="role" onChange={this.handleChange}>
                                        <option value="Select">Please Select</option>
                                        <option value="Admin">Admin</option>
                                        <option value="ViewOnly">ViewOnly</option>
                                        <option value="Edit">Edit</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={this.saveUser} class="btn btn-primary">Submit</button>
                        &nbsp;
                            <button onClick={this.closeDialog} class="btn btn-default">Cancel</button>
                    </div>
                </Modal.Footer>
            </Modal >
        );
    }
}

