export interface Subscriber {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  startDate: string; // ISO Dates from API
  endDate: string | null;
  status: 'active' | 'inactive';
}

export interface Settings {
  id: string;
  aliasMercadoPago: string;
  isPrismaActive?: boolean;
}
