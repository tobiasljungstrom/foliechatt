var React = require('react');

var NewUser = React.createClass({
    render: function() {
        return (
            <form>
                <table>
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
                </table>
            </form>
        );
    }
});

module.exports = NewUser;
