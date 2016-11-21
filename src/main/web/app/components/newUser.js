var React = require('react');

var NewUser = React.createClass({

    submitNewUser: function() {
        const newUserForm = document.getElementById('newUserForm');

        const alias = newUserForm.elements['aliasInput'];
        const email = newUserForm.elements['emailInput'];
        const password = newUserForm.elements['passwordInput'];

        console.log(alias.value + ' ' + email.value + ' ' + password.value);


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
                            <td><input type="submit" onClick={this.submitNewUser}/></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
});

module.exports = NewUser;
