import { z } from "zod";

export const scheduleSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  interval: z.coerce // coerce convierte el string del input a número
    .number({ invalid_type_error: "Debe ser un número." })
    .int("Debe ser un número entero.")
    .positive("Debe ser un número positivo."),
  duration: z.coerce // coerce convierte el string del input a número
    .number({ invalid_type_error: "Debe ser un número." })
    .int("Debe ser un número entero.")
    .positive("Debe ser un número positivo."),
  code: z.string().min(1, "El código es requerido."),
  loop: z.boolean(),

  // Campos de Localización (IDs como strings, ya que vienen del select)
  country_id: z.string().min(1, "Debe seleccionar un país."),
  country_name: z.string().min(1, "El nombre del país es requerido."), // Se llenará programáticamente
  state_id: z
    .string()
    .min(1, "Debe seleccionar un estado.")
    .optional()
    .or(z.literal("")), // Puede ser opcional si no todos los países tienen estados
  state_name: z.string().optional(),
  city_id: z
    .string()
    .min(1, "Debe seleccionar una ciudad.")
    .optional()
    .or(z.literal("")),
  city_name: z.string().optional(),

  type_schedule_id: z.string(),
  client_id: z.string().optional(),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

export const typeScheduleSchema = z.object({
  name: z
    .string()
    .nonempty("El nombre es requerido.")
    .min(3, "El nombre debe tener al menos 3 caracteres."),
});

export type TypeScheduleFormData = z.infer<typeof typeScheduleSchema>;
