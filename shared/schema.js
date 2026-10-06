import { z } from "zod";

export const createFieldSchema = z.object({
  name: z.string().min(2, "Field name must be at least 2 characters"),
  locationName: z.string().min(2, "Location name is required"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  areaHectares: z.number().positive("Area must be a positive number"),
  soilType: z.enum(["Sandy", "Loamy", "Clay", "Silt", "Peat", "Chalky"]),
  nitrogenPpm: z.number().min(0, "Min 0 PPM").max(1000, "Max 1000 PPM"),
  phosphorusPpm: z.number().min(0, "Min 0 PPM").max(1000, "Max 1000 PPM"),
  potassiumPpm: z.number().min(0, "Min 0 PPM").max(1000, "Max 1000 PPM"),
  phLevel: z.number().min(3.0, "pH min 3.0").max(10.0, "pH max 10.0"),
  organicMatterPct: z.number().min(0).max(100).optional().nullable(),
  irrigationType: z.enum(["Drip", "Sprinkler", "Flood", "Rainfed", "Pivot"])
});

export const updateFieldSchema = createFieldSchema.partial();

export const generateAdvisorySchema = z.object({
  fieldId: z.string().uuid("Invalid Field UUID"),
  season: z.enum(["Spring", "Summer", "Autumn", "Winter", "Monsoon", "Dry Season"]),
  targetLanguage: z.enum(["en", "es", "hi", "sw", "fr"]).default("en")
});

export const userSettingsSchema = z.object({
  fullName: z.string().min(2).optional(),
  preferredLanguage: z.enum(["en", "es", "hi", "sw", "fr"]).default("en"),
  unitSystem: z.enum(["metric", "imperial"]).default("metric")
});
