var React = require('react');

var Message = React.createClass({
    render: function() {
        return (
            <span dangerouslySetInnerHTML={{__html: this.props.message}} />
        );
    }
});

module.exports = Message;