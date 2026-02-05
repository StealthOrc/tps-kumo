import z from "zod";

export const tpsSchema = z.object({
	id: z.uuid(),
	tps: z.int(),
	timestamp: z
		.union([z.string(), z.date()])
		.transform((val) => (typeof val === "string" ? val : val.toISOString())),
});
/*
reference: 
{
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
*/

export const addTpsTpsSchema = z.object({
	worldName: z.string(),
	worldUUID: z.string(),
	time: z
		.union([z.string(), z.date()])
		.transform((val) => (typeof val === "string" ? val : val.toISOString())),
	tpsMstpMap: z.record(z.string(), z.array(z.number())),
});
export const addTpsSchema = z.object({ tpsData: z.array(addTpsTpsSchema) });

export type TPS = z.infer<typeof tpsSchema>;
export type AddTps = z.infer<typeof addTpsSchema>;
export type AddTpsTps = z.infer<typeof addTpsTpsSchema>;

export const messageSchema = z.union([tpsSchema, addTpsSchema]);
export type Message = z.infer<typeof messageSchema>;
