var React = require('react');
var ChatActions = require('../actions/ChatActions');

var MessageForm = React.createClass({
    getInitialState: function() {
        return {
            text: ''
        };
    },
    render: function() {
        var style = {
            width: '100%'
        };

        var loggedOut = this.props.self.userid === 0;

        return (
            <nav className="navbar navbar-default navbar-fixed-bottom">
                  <div className="container">
                      <div className="row">
                        <form onSubmit={this._onFormSubmit} className="navbar-form" role="chat">
                            <div className="input-group">
                                <input 
                                    type="text"
                                    maxLength="255"
                                    className="form-control"
                                    placeholder="Send a message..."
                                    value={this.state.text}
                                    autoFocus={true}
                                    onChange={this._onChange}
                                    disabled={loggedOut}
                                />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="submit" disabled={loggedOut}>Send</button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </nav>
        );
    },
    _onFormSubmit: function(event) {
        event.preventDefault();
        var msg = this.state.text.trim().slice(0, 255);

        this.setState({text: ''});
        if (!msg) {
            return;
        }

        ChatActions.sendMessage(msg);
    },
    _onChange: function(event) {
        this.setState({
            text: event.target.value
        });
    }
});

module.exports = MessageForm;