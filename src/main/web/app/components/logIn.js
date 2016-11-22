var React = require('react');

var LogIn = React.createClass({

    logIn: function() {
        //console.log("Log in clicked");
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
