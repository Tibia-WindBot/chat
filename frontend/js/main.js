var MessageContainer = require('./components/MessageContainer');
var React = require('react');
var moment = require('moment');
var Notify = require('notifyjs');

moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow] LT',
        lastWeek : '[last] dddd',
        nextWeek : 'dddd [at] LT',
        sameElse : 'L'
    }
});

React.render(<MessageContainer/>, document.getElementById('chat-container'), function () {
	if (window.self != window.top) {
		document.body.classList.add('iframe');
	}

	Notify.requestPermission();
});

