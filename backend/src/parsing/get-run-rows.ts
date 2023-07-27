export function contiguousArrayItems(array: any[], atIndex: number) {
	let startIndex: number | undefined = undefined,
		endIndex: number | undefined = undefined;

	for (let i = atIndex, len = array.length; i < len; i++) {
		// iterate forward from the starting point to get end index
		if (array[i] == array[atIndex]) {
			// if the value of this element and the original element match, this is part of a contiguous run of elements.
			endIndex = i; // just keep on setting the end index higher until it no longer matches
		} else {
			break;
		}
	}

	for (let i = atIndex; i > 0; i--) {
		// iterate backward from the starting point to get start index
		if (array[i] == array[atIndex]) {
			// if the value of this element and the original element match, this is part of a contiguous run of elements.
			startIndex = i; // just keep on setting the start index lower until it no longer matches
		} else {
			break;
		}
	}

	if (startIndex !== undefined && endIndex !== undefined) {
		return {
			start: startIndex,
			end: endIndex,
		};
	}
}
