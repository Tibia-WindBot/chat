var React = require('react');
var MessageBlock = require('./MessageBlock');
var DaySeparator = require('./DaySeparator');

var MessageList = React.createClass({
    render: function() {
        var self = this;

        // Just a simple function to generate a unique key, because React needs that...
        var generateMessageBlock = function(userid, username, usergroupid, time, messages, selfInfo) {
            var key = userid + '-' + time.valueOf();

            return (
                <MessageBlock
                    key={key}
                    userid={userid}
                    time={time}
                    username={username}
                    usergroupid={usergroupid}
                    messages={messages}
                    self={selfInfo}
                />
            );
        };

        var renderList = [];
        var lastDay = null; // to make day separator

        var lastSenderName = null;
        var lastSenderId = null;
        var lastSenderUsergroup = null;
        var lastSenderTime = null;
        var lastSenderMessages = [];
        this.props.messages.forEach(function(msg) {
            if (msg.dontshow) { // dontshow messages belong to muted users, we will not show them
                return
            };

            if (lastDay !== null && lastSenderId !== null) {
                /* If the message was sent by a different user than last message, OR
                   the message was sent by the same user but over 2 minutes ago, OR
                   the day changed between each sent message THEN
                   push a messageblock
                */
                if (lastSenderId !== msg.userid || msg.time.diff(lastDay, 'minutes') >= 2 || lastDay.date() !== msg.time.date()) {
                    renderList.push(generateMessageBlock(lastSenderId, lastSenderName, lastSenderUsergroup, lastSenderTime, lastSenderMessages, self.props.self));

                    // Push a day separator if last message was sent in a different day
                    if (lastDay.date() !== msg.time.date()) {
                        renderList.push(<DaySeparator key={msg.time.unix()} date={msg.time}/>);
                    }

                    lastSenderMessages = [];
                    lastSenderTime = null;
                }
            } else {
                // Push a day separator for the first message
                renderList.push(<DaySeparator key={msg.time.unix()} date={msg.time}/>);
            }

            lastSenderTime = lastSenderTime || msg.time;

            lastDay = msg.time;
            lastSenderId = msg.userid;
            lastSenderUsergroup = msg.usergroupid
            lastSenderName = msg.username;
            lastSenderMessages.push(msg.message);
        });

        // Push the last message
        if (lastSenderId !== null) {
            renderList.push(generateMessageBlock(lastSenderId, lastSenderName, lastSenderUsergroup, lastSenderTime, lastSenderMessages, self.props.self));
        }

        return (
            <div className="container">
                {renderList}
            </div>
        );
    }
});

module.exports = MessageList;