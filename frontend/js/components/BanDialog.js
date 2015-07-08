var React = require('react');

var BanDialog = React.createClass({
    handleBanSubmit: function(e) {
        e.preventDefault();
        var reason = React.findDOMNode(this.refs.reason).value.trim().slice(0, 140);
        var duration = parseInt(React.findDOMNode(this.refs.duration).value);
        
        this.props.onBanUser(this.props.username, reason, duration);

        // clear up text after sending
        React.findDOMNode(this.refs.reason).value = '';
        React.findDOMNode(this.refs.duration).value = '';

        $('#bandialog').modal('hide');

        return;
    },
    componentDidMount: function() {
        $('#bandialog').on('shown.bs.modal', function () {
          $('#inputReason').focus();
        });
    },
    render: function() {
        return (
          <div id="bandialog" className="modal fade bs-example-modal-md" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Banning user: {this.props.username}</h4>
                </div>
                <div className="modal-body">
                  <form className="form-horizontal" role="ban" onSubmit={this.handleBanSubmit}>
                    <div className="form-group">
                      <label htmlFor="inputReason" className="col-sm-2 control-label">Reason</label>
                      <div className="col-sm-10">
                        <input type="text" maxLength="140" className="form-control" id="inputReason" ref="reason" placeholder="Enter a reason for the ban"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputDuration" className="col-sm-2 control-label">Duration</label>
                      <div className="col-sm-10">
                        <input type="number" className="form-control" id="inputDuration" ref="duration" placeholder="Enter the duration in seconds (0 for permanent ban)"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-2 col-sm-10">
                        <button type="submit" className="btn btn-primary">Submit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = BanDialog;