var React = require('react');
var Message = require('./Message');
var UserLink = require('./UserLink');

var startTime = Math.floor(new Date().valueOf()/1000);

var MessageBlock = React.createClass({
    render: function() {
        var url = (this.props.userid > 0 ? ('https://forums.tibiawindbot.com/member.php?' + this.props.userid + '-' + this.props.username) : "#");
        var imgurl = (this.props.userid > 0 ? ('https://forums.tibiawindbot.com/image.php?u=' + this.props.userid + '&dateline=' + startTime + '&type=thumb') : '/assets/images/logo.png');
        var timeFormatted = this.props.time.format('LT');

        var messages = [];
        this.props.messages.forEach(function(msg, index) {
            messages.push(<Message key={index} message={msg}/>);
        });

        return (
            <div className="row message-box">
                <div className="col-sm-1 col-xs-2 user-avatar">
                    <a target="_blank" href={url}>
                        <img className="img-circle user-avatar" src={imgurl}></img>
                    </a>
                </div>

                <div className="col-sm-11 col-xs-10 message">
                    <abbr className="pull-right">{timeFormatted}</abbr>
                    <UserLink username={this.props.username} unixtime={this.props.time.unix()} userid={this.props.userid} usergroupid={this.props.usergroupid} url={url} self={this.props.self} handleMuteUser={this.props.handleMuteUser} handleBanUser={this.props.handleBanUser}/>
                    {messages}
                </div>
            </div>
        );
    }
});

module.exports = MessageBlock;