import React from 'react';
import { PrismaClient } from '@prisma/client';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAdminData() {
  const prisma = new PrismaClient();
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { startDate: 'desc' }
    });
    
    let settings = await prisma.settings.findUnique({
      where: { id: 'global_config' }
    });
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'global_config', aliasMercadoPago: 'mendez.mp' }
      });
    }

    return {
      subscribers: JSON.parse(JSON.stringify(subscribers)),
      settings: JSON.parse(JSON.stringify(settings))
    };
  } catch (error) {
    console.error("Prisma error in admin page:", error);
    return { subscribers: [], settings: null };
  } finally {
    await prisma.$disconnect();
  }
}

export default async function AdminPage() {
  const { subscribers, settings } = await getAdminData();

  return (
    <AdminDashboardClient 
      initialSubscribers={subscribers} 
      initialSettings={settings} 
    />
  );
}
