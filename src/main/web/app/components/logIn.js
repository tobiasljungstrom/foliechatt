var React = require('react');

var LogIn = React.createClass({
    propTypes : {
        setSessionToken: React.PropTypes.func.isRequired,
        setLoggedInUser: React.PropTypes.func.isRequired
    },

    logIn: function() {
        const setSessionToken = this.props.setSessionToken;
        const setLoggedInUser = this.props.setLoggedInUser;

        const logInForm = document.getElementById('logInForm');

        //Collect the form data
        const email = logInForm.elements['emailInput'].value;
        const password = logInForm.elements['passwordInput'].value;

        //Create the data object that will be sent to the backend
        const data = JSON.stringify({
            email: email,
            password: password
        });

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //Callback triggers on success
            if (this.readyState == 4 && this.status == 200) {
                let loginResponse = JSON.parse(request.responseText);
                console.log(loginResponse);
                setLoggedInUser(loginResponse.user);
                setSessionToken(loginResponse.sessionToken);

                //console.log('LOG IN IS GOOD');
            } else if(this.readyState == 4 && this.status == 401) {
                console.log('UNATHORIZED');
            }

        };
        request.open('POST', 'http://localhost:9876/foliechatt/api/v.1/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(data);
    },

    render: function() {
        return (
            <form id="logInForm" className="form">
                <div className="formTitle">Log In</div>
                <table>
                    <tbody>
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
                            <td><input type="button" onClick={this.logIn} value="Log In"/></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
});

module.exports = LogIn;
