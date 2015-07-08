var React = require('react');

var NavHeader = React.createClass({
    render: function() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="#"><img className="img-responsive" style={{maxHeight: '40px'}} src="https://www.tibiawindbot.com/img/logo-header.png"></img></a>

                    <ul className="nav navbar-nav navbar-right hidden-xs">
                        <li><a href="#">Chat powered by io.js and React</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
});

module.exports = NavHeader;