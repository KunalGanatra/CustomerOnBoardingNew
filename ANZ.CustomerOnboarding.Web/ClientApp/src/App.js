import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { history } from './helpers/history';
import { Role } from './helpers/role'
import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './components/Login/LoginPage';
import { AdminPage } from './components/Admin/AdminPage';
import { SearchCustomerPage } from './components/Customer/SearchCustomerPage';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser, isAdmin } = this.state;
        return (
            <Router history={history}>
                <div>
                    {currentUser &&
                        <Navbar inverse fixedTop fluid collapseOnSelect>
                            <Navbar.Header>
                                <Navbar.Brand>
                                    <Link to={'/'}>Customer OnBoarding</Link>
                                </Navbar.Brand>
                                <Navbar.Toggle />
                            </Navbar.Header>
                            <Navbar.Collapse>
                                <Nav>
                                    <LinkContainer to={'/'} exact>
                                        <NavItem>
                                            <Glyphicon glyph='home' /> Customer
                                      </NavItem>
                                    </LinkContainer>
                                    {isAdmin && <LinkContainer to={'/admin'}>
                                        <NavItem>
                                            <Glyphicon glyph='education' /> Admin
                                      </NavItem>
                                    </LinkContainer>}
                                    <NavItem>
                                        <a href="/" onClick={this.logout}>Logout</a>
                                    </NavItem>

                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    }
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 offset-md-3 c">
                                    <PrivateRoute exact path="/" component={SearchCustomerPage} />
                                    <PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
                                    <Route path="/login" component={LoginPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}




