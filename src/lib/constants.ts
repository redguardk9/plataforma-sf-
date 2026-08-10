// Constantes de domínio (substituem os enums, que o SQLite não suporta no Prisma)

export const ROLE = { USER: "USER", ADMIN: "ADMIN" } as const;
export type Role = (typeof ROLE)[keyof typeof ROLE];

export const COURSE_TYPE = { RECORDED: "RECORDED", LIVE: "LIVE" } as const;
export type CourseType = (typeof COURSE_TYPE)[keyof typeof COURSE_TYPE];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const ENROLLMENT_STATUS = { ACTIVE: "ACTIVE", PENDING: "PENDING" } as const;

// ---- Agenda ----
export const SERVICE_TYPE = {
  CONSULTA: "CONSULTA",
  SUPERVISAO: "SUPERVISAO",
  CONSULTORIA: "CONSULTORIA",
  QUALQUER: "QUALQUER",
} as const;
export type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];
export const SERVICE_TYPE_LABEL: Record<string, string> = {
  CONSULTA: "Consulta",
  SUPERVISAO: "Supervisão",
  CONSULTORIA: "Consultoria",
  QUALQUER: "Qualquer serviço",
};

export const APPOINTMENT_MODE = { ONLINE: "ONLINE", PRESENCIAL: "PRESENCIAL" } as const;
export type AppointmentMode = (typeof APPOINTMENT_MODE)[keyof typeof APPOINTMENT_MODE];
export const APPOINTMENT_MODE_LABEL: Record<string, string> = {
  ONLINE: "Online",
  PRESENCIAL: "Presencial",
};

export const SLOT_STATUS = { OPEN: "OPEN", BOOKED: "BOOKED", BLOCKED: "BLOCKED" } as const;
export const SLOT_STATUS_LABEL: Record<string, string> = {
  OPEN: "Disponível",
  BOOKED: "Reservado",
  BLOCKED: "Bloqueado",
};

export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;
export const APPOINTMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

// ---- Fuso horário ----
// Todo o site é de Portugal continental: datas exibidas e horas introduzidas no
// admin referem-se SEMPRE a Europe/Lisbon, independentemente do fuso do servidor
// (em produção, ex.: Vercel, o servidor corre em UTC).
export const TZ = "Europe/Lisbon";

/** Deslocamento (localTime − UTC) em ms para o fuso, no instante indicado. */
function tzOffsetMs(timeZone: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(at)) p[part.type] = part.value;
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUTC - at.getTime();
}

/**
 * Converte uma hora "de parede" de Lisboa (ex.: date "2026-08-01", time "10:00")
 * no instante UTC correto a guardar — lidando com o horário de verão (WEST/WET).
 */
export function lisbonWallTimeToUtc(dateStr: string, timeStr: string): Date | null {
  const guess = new Date(`${dateStr}T${timeStr}:00Z`); // trata a hora de parede como se fosse UTC
  if (isNaN(guess.getTime())) return null;
  const offset = tzOffsetMs(TZ, guess);
  return new Date(guess.getTime() - offset);
}

// ---- Helpers de formatação ----
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, ...(opts ?? { day: "2-digit", month: "long", year: "numeric" }) }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, day: "2-digit" }).format(d);
  const month = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, month: "short" }).format(d).replace(".", "").toUpperCase();
  return `${day} ${month}`;
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: TZ,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function isLive(type: string): boolean {
  return type === COURSE_TYPE.LIVE;
}
