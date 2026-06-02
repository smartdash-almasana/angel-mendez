import { PrismaClient } from '@prisma/client';

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  startDate: Date;
  endDate: Date | null;
  status: string; // 'active' | 'inactive'
}

export interface Settings {
  id: string;
  aliasMercadoPago: string;
}

// Global variable to keep in-memory fallback state in dev
let mockSubscribers: Subscriber[] = [
  {
    id: "sub-1",
    name: "Dra. Florencia Bianchi",
    email: "florencia.b@derecho.uba.ar",
    whatsapp: "+54 9 11 9876-5432",
    startDate: new Date("2026-05-01T12:00:00Z"),
    endDate: new Date("2026-11-01T12:00:00Z"),
    status: "active"
  },
  {
    id: "sub-2",
    name: "Dr. Mateo Fernández",
    email: "fernandez.penal@live.com.ar",
    whatsapp: "+54 9 341 555-1234",
    startDate: new Date("2026-04-15T12:00:00Z"),
    endDate: new Date("2026-10-15T12:00:00Z"),
    status: "active"
  },
  {
    id: "sub-3",
    name: "Dra. Valentina Sosa",
    email: "valentina.sosa@estudio.com.ar",
    whatsapp: "+54 9 261 444-9876",
    startDate: new Date("2026-01-10T12:00:00Z"),
    endDate: new Date("2026-07-10T12:00:00Z"),
    status: "inactive"
  }
];

let mockSettings: Settings = {
  id: "global_config",
  aliasMercadoPago: "mentoriamendez.mp"
};

// Lazy initialization of Prisma client
let prisma: PrismaClient | null = null;
let isPrismaAvailable = false;

function getPrisma(): PrismaClient {
  if (!prisma) {
    const hasUrl = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("user:password");
    if (hasUrl) {
      try {
        prisma = new PrismaClient();
        isPrismaAvailable = true;
      } catch (err) {
        console.warn("Prisma failed to initialize, falling back to memory database:", err);
        isPrismaAvailable = false;
      }
    } else {
      isPrismaAvailable = false;
    }
  }
  return prisma as PrismaClient;
}

// Safe database operation wrappers
export async function getSettings(): Promise<Settings> {
  const checkPrisma = getPrisma();
  if (isPrismaAvailable && checkPrisma) {
    try {
      let settings = await checkPrisma.settings.findUnique({
        where: { id: 'global_config' }
      });
      if (!settings) {
        settings = await checkPrisma.settings.create({
          data: { id: 'global_config', aliasMercadoPago: 'mentoriamendez.mp' }
        });
      }
      return settings;
    } catch (error) {
      console.error("Prisma error getting settings, using mock:", error);
      return mockSettings;
    }
  }
  return mockSettings;
}

export async function updateSettings(aliasMercadoPago: string): Promise<Settings> {
  const checkPrisma = getPrisma();
  const cleanAlias = aliasMercadoPago.trim();
  if (isPrismaAvailable && checkPrisma) {
    try {
      const settings = await checkPrisma.settings.upsert({
        where: { id: 'global_config' },
        update: { aliasMercadoPago: cleanAlias },
        create: { id: 'global_config', aliasMercadoPago: cleanAlias }
      });
      return settings;
    } catch (error) {
      console.error("Prisma error updating settings, updating mock:", error);
      mockSettings.aliasMercadoPago = cleanAlias;
      return mockSettings;
    }
  }
  mockSettings.aliasMercadoPago = cleanAlias;
  return mockSettings;
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const checkPrisma = getPrisma();
  if (isPrismaAvailable && checkPrisma) {
    try {
      return await checkPrisma.subscriber.findMany({
        orderBy: { startDate: 'desc' }
      }) as unknown as Subscriber[];
    } catch (error) {
      console.error("Prisma error getting subscribers, using mock:", error);
      return mockSubscribers;
    }
  }
  return mockSubscribers;
}

export async function toggleSubscriberStatus(id: string): Promise<Subscriber> {
  const checkPrisma = getPrisma();
  if (isPrismaAvailable && checkPrisma) {
    try {
      const sub = await checkPrisma.subscriber.findUnique({ where: { id } });
      if (!sub) throw new Error("Subscriber not found");
      const nextStatus = sub.status === 'active' ? 'inactive' : 'active';
      return await checkPrisma.subscriber.update({
        where: { id },
        data: { status: nextStatus }
      }) as unknown as Subscriber;
    } catch (error) {
      console.error("Prisma error toggling subscriber status, toggling mock:", error);
    }
  }

  const index = mockSubscribers.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSubscribers[index] = {
      ...mockSubscribers[index],
      status: mockSubscribers[index].status === 'active' ? 'inactive' : 'active'
    };
    return mockSubscribers[index];
  }
  throw new Error("Subscriber not found in mock store");
}

export async function addSubscriber(data: { name: string; email: string; whatsapp: string; months: number }): Promise<Subscriber> {
  const checkPrisma = getPrisma();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + data.months);

  if (isPrismaAvailable && checkPrisma) {
    try {
      return await checkPrisma.subscriber.create({
        data: {
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          startDate,
          endDate,
          status: 'active'
        }
      }) as unknown as Subscriber;
    } catch (error) {
      console.error("Prisma error adding subscriber, using mock fallback:", error);
    }
  }

  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp,
    startDate,
    endDate,
    status: 'active'
  };
  mockSubscribers.push(newSub);
  return newSub;
}

export async function deleteSubscriber(id: string): Promise<void> {
  const checkPrisma = getPrisma();
  if (isPrismaAvailable && checkPrisma) {
    try {
      await checkPrisma.subscriber.delete({ where: { id } });
      return;
    } catch (error) {
      console.error("Prisma error deleting subscriber, using mock:", error);
    }
  }
  mockSubscribers = mockSubscribers.filter(s => s.id !== id);
}

export function isPrismaActive(): boolean {
  return isPrismaAvailable;
}
