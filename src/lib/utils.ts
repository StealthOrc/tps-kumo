export const range = (start: number, stop: number, step = 1) =>
	Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export const rand_range = (min: number, max: number) =>
	Math.random() * (max - min) + min;

export const rand_range_int = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const rand_tps = () => rand_range_int(-1, 30);
