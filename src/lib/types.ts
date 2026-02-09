import z from "zod";

namespace ZodUtils {
	export const zodSafeDateString = z
		.union([z.string(), z.date()])
		.transform((val) => (typeof val === "string" ? val : val.toISOString()));
}

export namespace Internal {
	export const tpsSchema = z.object({
		worldName: z.string(),
		worldUUID: z.string(),
		time: ZodUtils.zodSafeDateString,
		interval: z.number(),
		tps: z.number(),
		mspt: z.number(),
	});
	export const tpsArrSchema = z.array(tpsSchema);
	export const tpsPointSchema = z.object({
		time: ZodUtils.zodSafeDateString,
		tps: z.number(),
		mspt: z.number(),
	});
	export const tpsPointArrSchema = z.array(tpsPointSchema);
	// tpsMap of worldUUID: (interval : TPSPoint Array)
	export const tpsPointMapSchema = z.object({
		tpsData: z.record(
			z.uuid(),
			z.object({
				worldName: z.string(),
				intervalData: z.record(z.string(), z.array(tpsPointSchema)),
			}),
		),
	});

	//verbose TPS Info with interval and world info
	export type TPS = z.infer<typeof tpsSchema>;
	export type TPSArr = TPS[];

	//stripped TPS point info
	export type TPSPoint = z.infer<typeof tpsPointSchema>;
	export type TPSPointArr = z.infer<typeof tpsPointArrSchema>;
	/*
reference: 
{
	tpsData: {
		"worldName": "default",
		"worldUUID": "1bcb661a-5522-4f5e-89d4-e68d18fc37aa",
		"time": "2026-01-26T23:29:50.3253418+01:00[Europe/Berlin]",
		"tpsMstpMap": {
			"1": [  // interval
			30.0, //TPS
			0.1297 //MSPT
			],
			"10": [
			30.0,
			0.09286228956228967
			],
			"60": [
			10.0,
			0.55
			]
		}	
	}
}
	 */
	export type TPSPointMap = z.infer<typeof tpsPointMapSchema>;
}

export namespace External {
	/*
reference: 
{
	tpsData: [
		"worldName": "default",
		"worldUUID": "1bcb661a-5522-4f5e-89d4-e68d18fc37aa",
		"time": "2026-01-26T23:29:50.3253418+01:00[Europe/Berlin]",
		"tpsMstpMap": {
			"1": [  // interval
			30.0, //TPS
			0.1297 //MSPT
			],
			"10": [
			30.0,
			0.09286228956228967
			],
			"60": [
			10.0,
			0.55
			]
		}
	]
}
*/
	export const tpsSchema = z.object({
		worldName: z.string(),
		worldUUID: z.string(),
		time: ZodUtils.zodSafeDateString,
		tpsMstpMap: z.record(z.string(), z.array(z.number())),
	});
	export const addTpsSchema = z.object({
		tpsData: z.array(tpsSchema),
	});

	export type AddHytaleTps = z.infer<typeof addTpsSchema>;
	export type TPS = z.infer<typeof tpsSchema>;
}

export const messageSchema = z.union([
	External.addTpsSchema,
	Internal.tpsPointMapSchema,
]);
export type Message = z.infer<typeof messageSchema>;

export type WorldUUID = string;
export type Interval = number;
