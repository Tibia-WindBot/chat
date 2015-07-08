var React = require('react');

var DaySeparator = React.createClass({
    render: function() {
        var when = this.props.date.calendar();

        return (
            <li className="day-separator">
                <span>{when}</span>
            </li>
        );
    }
});

module.exports = DaySeparator;