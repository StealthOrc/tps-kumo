import type { Internal } from "./types";

export const range = (start: number, stop: number, step = 1) =>
	Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export const rand_range = (min: number, max: number) =>
	Math.random() * (max - min) + min;

export const rand_range_int = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function compareTimes(a: string, b: string): number {
	const ta = new Date(a).getTime();
	const tb = new Date(b).getTime();
	if (ta < tb) return -1;
	if (ta > tb) return 1;
	return 0;
}

export namespace TPS {
	export function findInsertIndex(
		arr: Internal.TPSPoint[],
		time: string,
	): { index: number; found: boolean } {
		let low = 0;
		let high = arr.length - 1;

		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			const cmp = compareTimes(time, arr[mid]?.time);
			console.log(
				`findInsertIndex(): length:${arr.length} idx:${mid} ${arr[mid]?.time} vs ${time}`,
			);
			if (cmp === 0) {
				return { index: mid, found: true };
			}

			if (cmp < 0) {
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}
		return { index: low, found: false };
	}
}
export const rand_tps = () => rand_range_int(-1, 30);
