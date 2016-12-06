var React = require('react');

var NewUser = React.createClass({
    propTypes: {
        baseUrl: React.PropTypes.string
    },

    getInitialState: function () {
        return {userResponse: ''};
    },

    submitNewUser: function() {
        const newUserForm = document.getElementById('newUserForm');

        //Collect the form data
        const alias = newUserForm.elements['aliasInput'].value;
        const email = newUserForm.elements['emailInput'].value;
        const password = newUserForm.elements['passwordInput'].value;
        const setState = this.setState.bind(this);
        //Create the data object that will be sent to the backend
        const data = JSON.stringify({
            alias:alias,
            email: email,
            password: password
        });

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //Callback triggers on success
            //TODO: Do something useful here
            if (this.readyState == 4 && this.status == 200) {
                console.log("OK"+this.responseText);
                setState({userResponse: "User created"});
            } else {
                console.log("User not added");
                setState({userResponse: request.responseText});
            }

        };
        request.open('POST', `${this.props.baseUrl}api/v.1/users`, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(data);
    },

    render: function() {
        return (
            <form id="newUserForm" className="form">
                <div className="formTitle">New User</div>
                <table>
                    <tbody>
                        <tr>
                            <td>Alias:</td>
                            <td><input type="text" name="aliasInput"/></td>
                        </tr>
                        <tr>
                            <td>E-mail:</td>
                            <td><input type="email" name="emailInput"/></td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td><input type="password" name="passwordInput"/></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><div className="btn btn-default" onClick={this.submitNewUser}>Submit</div></td>
                        </tr>
                        <tr>
                            <td>{this.state.userResponse}</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
});

module.exports = NewUser;
