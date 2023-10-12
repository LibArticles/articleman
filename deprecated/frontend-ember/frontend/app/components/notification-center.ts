import Component from '@glimmer/component';



export default class NotificationCenterComponent extends Component {
}

interface AMNotification {
	format: 'toast' | 'alert' | 'quiet';
	title: string;
	message: string;
	toRoute?: string;
	severity?: 'info' | 'warning' | 'error';
}
