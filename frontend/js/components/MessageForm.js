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

                                /*<input 
                                    type="text"
                                    maxLength="255"
                                    className="form-control"
                                    placeholder="Send a message..."
                                    value={this.state.text}
                                    autoFocus={true}
                                    onChange={this._onChange}
                                    disabled={loggedOut}
                                />*/

        return (
            <nav className="navbar navbar-default navbar-fixed-bottom">
                  <div className="container">
                      <div className="row">
                        <form onSubmit={this._onFormSubmit} className="navbar-form" role="chat">
                            <div className="input-group">
                                <textarea
                                    className="form-control"
                                    maxLength="255"
                                    placeholder="Send a message..."
                                    value={this.state.text}
                                    autoFocus={true}
                                    onChange={this._onChange}
                                    onKeyDown={this._onKeyDown}
                                    disabled={loggedOut}
                                    rows="1">
                                </textarea>
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
    },
    _onKeyDown: function(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            return this._onFormSubmit(event);
        }
    }
});

module.exports = MessageForm;