import { Inside } from "casement";

export default class Socketeer {
	private casement: Inside;

	





	constructor() {
		this.casement = new Inside({
			allowedDomain: '*',
			name: 'socketeer',
			onReady: () => {
				
			}
		});


	}
}

