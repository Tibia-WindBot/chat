var React = require('react');
var ChatActions = require('../actions/ChatActions');

var UserLink = React.createClass({
    handleMuteUser: function(e) {
        e.preventDefault();
        ChatActions.muteUser(this.props.username);

        return;
    },
    handleBanUser: function(e) {
        e.preventDefault();
        ChatActions.banUser(this.props.username);

        return;
    },
    render: function() {
        if (this.props.userid === 0) {
            // Messages sent by server
            return (
                  <h5>
                      <a className='user-link' href={this.props.url}>
                        {this.props.username}
                      </a>
                  </h5>
              );
        }

        var usergroupClasses = [
            /*0*/'',
            /*1*/'user-unregistered',
            /*2*/'user-registered',
            /*3*/'user-awaitingconfirmation',
            /*4*/'user-awaitingmoderation',
            /*5*/'user-supermoderators',
            /*6*/'user-admin',
            /*7*/'user-moderators',
            /*8*/'user-banned',
            /*9*/'user-wind-powered',
            /*10*/'',
            /*11*/'',
            /*12*/'user-wind-tester',
            /*13*/'',
            /*14*/'user-wind-reseller',
        ];
        var linkClass = 'user-link ' + (usergroupClasses[this.props.usergroupid] || '');

        var menu = [
            (<li key={'1-' + this.props.unixtime + this.props.userid}><a href={this.props.url} target="_blank"><i className="fa fa-user pull-right"></i>Show profile</a></li>),
            (<li key={'2-' + this.props.unixtime + this.props.userid} onClick={this.handleMuteUser}><a href="#"><i className="fa fa-microphone-slash pull-right"></i>Mute user</a></li>)
        ];
        
        if (this.props.self.isMod()) {
            menu.push(<li key={'3-' + this.props.unixtime + this.props.userid} role="separator" className="divider"></li>);
            menu.push(<li key={'4-' + this.props.unixtime + this.props.userid} onClick={this.handleBanUser}><a href="#"><i className="fa fa-ban pull-right"></i>Ban user</a></li>);
        }

        return (
          <h5>
            <div className="dropdown">
                <a className={linkClass} data-target="#" href={this.props.url} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    {this.props.username}<span className="caret"></span>
                </a>

                <ul className="dropdown-menu" aria-labelledby="dLabel">
                    {menu}
                </ul>
            </div>
          </h5>
        )
    }
});

module.exports = UserLink;