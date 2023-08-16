import { v4 as uuidv4 } from 'uuid';

class Names {
	static universal = 'TURNSTILE_CONCURRENCY_';
}

export default class Concurrency {

}

export class Turnstile {
	name: string;
	type: string;
	id: string;

	async enter(timeOut: number, error?: boolean) {
		if (!this.get(this.name)) {
			this.set(this.name, [this.id]);
		} else if (this.get(this.name)[0] !== this.id) {
			this.set(this.name, [...this.get(this.name), this.id]);

		}
		for (let i = 0; i < timeOut / 1000; i += 10) {
			Utilities.sleep(10);
			if (this.get(this.name)[0] === this.id || !this.get(this.name)) {
				return true;
			}

		}
		this.exit()

		if (error) {
			throw new Error('Turnstile was occupied for too long.');
		} else {
			return false;
		}
	}

	exit() {
		const arrayToDeleteMyNameIn: Array<string> = this.get(this.name);
		const arrayWithoutMyName = arrayToDeleteMyNameIn.splice(arrayToDeleteMyNameIn.indexOf(this.id));
		this.set(this.name, arrayWithoutMyName);
	}

	private get(key: string) {
		switch (this.type) {
			case 'document':
				return JSON.parse(CacheService.getDocumentCache().get(Names.universal + key));
			case 'script':
				return JSON.parse(CacheService.getScriptCache().get(Names.universal + key));
			case 'user':
				return JSON.parse(CacheService.getUserCache().get(Names.universal + key));
		}
	}

	private set(key: string, value: object) {
		switch (this.type) {
			case 'document':
				CacheService.getDocumentCache().put(Names.universal + key, JSON.stringify(value));
				break;
			case 'script':
				CacheService.getScriptCache().put(Names.universal + key, JSON.stringify(value));
				break;
			case 'user':
				CacheService.getUserCache().put(Names.universal + key, JSON.stringify(value));
				break;
		}
	}



	private delete(key: string) {
		switch (this.type) {
			case 'document':
				CacheService.getDocumentCache().remove(Names.universal + key);
				break;
			case 'script':
				CacheService.getScriptCache().remove(Names.universal + key);
				break;
			case 'user':
				CacheService.getUserCache().remove(Names.universal + key);
				break;
		}
	}

	constructor(name: string, type: 'document' | 'script' | 'user') {
		this.name = name;
		this.type = type;
		this.id = uuidv4();
	}
}
