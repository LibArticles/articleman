import Inside from "casement/src/inside";



export class CasementManager {
	private casement: Inside;

	send(data: any, actionName?: string) {
		this.casement.send(data, actionName);
	}

	request(data: any, actionName?: string) {
		return this.casement.request(data, actionName);
	}


	


	constructor() {
		this.casement = new Inside({
			allowedDomain: '*',
			name: 'socketeer',
			onReady: () => {
				
			},
			debug: true
		});


	}
}

const casementManager = new CasementManager();
export default casementManager;

