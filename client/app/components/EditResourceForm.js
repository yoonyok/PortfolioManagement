import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import TextFieldGroup from './TextFieldGroup';
import Button from './Button';
import { formBox } from '../styles/form.scss';
import PopupBox from './PopupBox';
import Dropdown from './Dropdown';
import { prodAPIEndpoint, RESOURCE_STATUS, USER_STATUS } from '../constants/constants';

class EditResourceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resourceManagers: [],
            id: this.props.location.state.data[0].Value,
            managerId: this.props.location.state.data[1].Value,
            firstName: this.props.location.state.data[2].Value,
            lastName: this.props.location.state.data[3].Value,
            address: this.props.location.state.data[4].Value,
            email: this.props.location.state.data[5].Value,
            password: this.props.location.state.data[6].Value,
            status: this.props.location.state.data[7].Value,
            enabled: this.props.location.state.data[8].Value,
            errors: {},
            successModalOpen: false,
            errorModalOpen: false,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCloseSuccess = this.onCloseSuccess.bind(this);
        this.onCloseError = this.onCloseError.bind(this);
    }

    componentDidMount() {
        this.getResourceManagers();
    }

    getResourceManagers() {
        axios.get(prodAPIEndpoint + '/users?role=RESOURCE_MANAGER', {headers: {Pragma: 'no-cache'}}).then((response) => {
                this.setState({resourceManagers: response.data});
        });
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.isValid()) {
            const id = this.state.id;
            axios.put(prodAPIEndpoint + '/users/' + id, {
                id: this.state.id,
                managerId: this.state.managerId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                email: this.state.email,
                // password: this.state.password,
                status: this.state.status,
                enabled: this.state.enabled,
            }).then((response) => {
                if (response.status === 200) {
                    this.setState({ successModalOpen: true });
                }
            }).catch((error) => {
                this.setState({ errorMessage: 'Error: ' + error.response.data.message, errorModalOpen: true });
            });
        }
    }

    onCloseSuccess() {
        this.props.history.push(`/resource/${this.state.id}`);
    }

    onCloseError() {
        this.setState({ errorModalOpen: false });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    isValid() {
        let hasError = true;

        if (!this.state.id) {
            this.setState({ errors: { id: 'Resource ID is required'}});
            hasError = false;
        }
        if (!this.state.managerId) {
            this.setState({ errors: { managerId: 'Manager ID is required'}});
            hasError = false;
        }
        if (!this.state.firstName) {
            this.setState({ errors: { firstName: 'Resource\'s first name is required' }});
            hasError = false;
        }
        if (!this.state.lastName) {
            this.setState({ errors: { lastName: 'Resource\'s last name is required' }});
            hasError = false;
        }
        if (!this.state.address) {
            this.setState({ errors: { address: 'Resource\'s address is required' }});
            hasError = false;
        }
        if (!this.state.email) {
            this.setState({ errors: { email: 'Resource\'s email is required' }});
            hasError = false;
        }
        if (!this.state.status) {
            this.setState({ errors: { status: 'Resource\'s status is required' }});
            hasError = false;
        }
        if (!this.state.enabled) {
            this.setState({ errors: { enabled: 'Resource\'s enabled status is required' }});
            hasError = false;
        }
        return hasError;
    }

    render() {
        const {id, managerId, firstName, lastName, address, email, status, enabled, errors, successModalOpen, errorModalOpen, errorMessage} = this.state;

        const managerObjects = this.state.resourceManagers.map((mo) => {
            return {id: mo.id, name: mo.firstName + ' ' + mo.lastName};
        });

        return (
            <div className={ formBox }>
                <form onSubmit={this.onSubmit}>
                    <h2>Edit Resource</h2>
                    <h3>Resource ID:{id}</h3>
                    <PopupBox
                        label="Successful!"
                        isOpen={successModalOpen}
                        onClose={this.onCloseSuccess}
                    />
                    <PopupBox
                        label={errorMessage}
                        isOpen={errorModalOpen}
                        onClose={this.onCloseError}
                    />
                     <Dropdown
                         label="Manager"
                         name="managerId"
                         preSelect={managerId}
                         data={managerObjects}
                         onSelect={this.onChange}
                         error={errors.managerId}
                    />
                    <TextFieldGroup
                        field="firstName"
                        label="First Name"
                        value={firstName}
                        error={errors.firstName}
                        onChange={this.onChange}
                    />
                    <TextFieldGroup
                        field="lastName"
                        label="Last Name"
                        value={lastName}
                        error={errors.lastName}
                        onChange={this.onChange}
                    />
                    <TextFieldGroup
                        field="address"
                        label="Address"
                        value={address}
                        error={errors.address}
                        onChange={this.onChange}
                    />
                    <TextFieldGroup
                        field="email"
                        label="Email"
                        value={email}
                        error={errors.email}
                        onChange={this.onChange}
                    />
                     <Dropdown
                         label="Status"
                         name="status"
                         preSelect={status}
                         data={RESOURCE_STATUS}
                         onSelect={this.onChange}
                         error={errors.status}
                    />
                     <Dropdown
                         label="User Status"
                         name="enabled"
                         preSelect={enabled}
                         data={USER_STATUS}
                         onSelect={this.onChange}
                         error={errors.enabled}
                    />
                    <Button
                        type="submit"
                        label="Save"
                    />
                </form>
            </div>
        );
    }
}

export default EditResourceForm;

EditResourceForm.propTypes = {
    data: PropTypes.any,
    location: PropTypes.any,
    history: PropTypes.any,
    match: PropTypes.any,
};
