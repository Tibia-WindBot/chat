var React = require('react');
var moment = require('moment');
var socket = require('../socket');
var MessageList = require('./MessageList');
var MessageForm = require('./MessageForm');
var NavHeader = require('./NavHeader');
var BanDialog = require('./BanDialog');
var ChatStore = require('../stores/ChatStore');

function getChatState() {
  return {
    messages: ChatStore.getMessages(),
    self: ChatStore.getUserInfo(),
    bandialog: {
        username: ''
    }
  };
}

var MessageContainer = React.createClass({
  settings: {
    autoscroll: true
  },
  getInitialState: function () {
    return getChatState();
  },
  componentDidMount: function() {
    var self = this;

    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() == $(document).height()) {
        self.settings.autoscroll = true;
      } else {
        self.settings.autoscroll = false;
      }
    });

    ChatStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ChatStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function() {
    if (this.settings.autoscroll) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  },

  render: function() {
    return (
      <div>
        <NavHeader/>
        <MessageList 
          messages={this.state.messages}
          self={this.state.self}
          handleMuteUser={this.onMuteUser}
          handleBanUser={this.handleBanUser}
        />
        <MessageForm self={this.state.self}/>
      </div>
    );

/*<BanDialog
  username={this.state.bandialog.username}
  onBanUser={this.onBanUser}
/>*/
  },
  /*handleBanUser: function(username) {
    if (!this.state.self.isMod()) {
      return;
    }

    this.setState({bandialog: {username: username}});
    $('#bandialog').modal('show');
  },*/

  _onChange: function() {
    this.setState(getChatState());
  }
});

module.exports = MessageContainer;