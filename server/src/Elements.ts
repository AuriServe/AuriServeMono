import { ServerDefinition } from 'common/definition';

export default class Elements {
	private lists: Set<Map<string, ServerDefinition>> = new Set();

	addList(list: Map<string, ServerDefinition>): void {
		this.lists.add(list);
	}

	removeList(list: Map<string, ServerDefinition>): void {
		this.lists.delete(list);
	}

	getAllElements(): Map<string, ServerDefinition> {
		const map: Map<string, ServerDefinition> = new Map();
		for (const m of this.lists) {
			for (const [k, v] of m) map.set(k, v);
		}
		return map;
	}
}
