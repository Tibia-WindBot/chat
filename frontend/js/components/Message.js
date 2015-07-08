var React = require('react');
var marked = require('marked');

var Message = React.createClass({
    render: function() {
        var rawText = '';
        if (this.props.isMarkdown) {
            rawText = marked(this.props.message.toString(), {sanitize: true});
        } else {
            rawText = this.props.message.toString();
        }

        return (
            <span dangerouslySetInnerHTML={{__html: rawText}} />
        );
    }
});

module.exports = Message;