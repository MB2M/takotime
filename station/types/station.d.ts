import { z } from "zod";
import { StationSettingsSchema } from "../schemas/StationSettingsSchema";

type StationSettings = z.infer<typeof StationSettingsSchema>;
