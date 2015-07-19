var React = require('react');
var Message = require('./Message');
var UserLink = require('./UserLink');

var startTime = Math.floor(new Date().valueOf()/1000);

var MessageBlock = React.createClass({
    render: function() {
        var url = (this.props.userid > 0 ? ('https://forums.tibiawindbot.com/member.php?' + this.props.userid + '-' + this.props.username) : "#");
        var imgurl = (this.props.userid > 0 ? ('https://forums.tibiawindbot.com/image.php?u=' + this.props.userid + '&dateline=' + startTime + '&type=thumb') : '/assets/images/logo.png');
        var timeFormatted = this.props.time.format('LT');
        var userAvatarStyle = {
            backgroundImage: 'url(' + imgurl + ')'
        };

        var messages = [];
        this.props.messages.forEach(function(msg, index) {
            messages.push(<Message key={index} message={msg}/>);
        });

        return (
            <div className="row message-box">
                <div className="user-avatar">
                    <a target="_blank" href={url}>
                        <div className="img-circle" style={userAvatarStyle}></div>
                    </a>
                </div>

                <div className="message">
                    <abbr className="pull-right">{timeFormatted}</abbr>
                    <UserLink username={this.props.username} unixtime={this.props.time.unix()} userid={this.props.userid} usergroupid={this.props.usergroupid} url={url} self={this.props.self} handleMuteUser={this.props.handleMuteUser} handleBanUser={this.props.handleBanUser}/>
                    {messages}
                </div>
            </div>
        );
    }
});

module.exports = MessageBlock;
