var React = require('react');

var NewUser = React.createClass({

    submitNewUser: function() {
        const newUserForm = document.getElementById('newUserForm');

        //Collect the form data
        const alias = newUserForm.elements['aliasInput'].value;
        const email = newUserForm.elements['emailInput'].value;
        const password = newUserForm.elements['passwordInput'].value;

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
                console.log(this.responseText);
            }

        }
        request.open("POST", "http://localhost:9876/foliechatt/api/v.1/users", true);
        request.setRequestHeader("Content-Type", "application/json");
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
                            <td><input type="button" onClick={this.submitNewUser} value="Submit"/></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
});

module.exports = NewUser;
