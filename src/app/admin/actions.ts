'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function toggleSubscriber(id: string) {
  try {
    const sub = await prisma.subscriber.findUnique({
      where: { id }
    });
    if (!sub) throw new Error("Subscriber not found");
    
    const newStatus = sub.status === 'active' ? 'inactive' : 'active';
    await prisma.subscriber.update({
      where: { id },
      data: { status: newStatus }
    });
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error("Action toggleSubscriber error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await prisma.subscriber.delete({
      where: { id }
    });
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error("Action deleteSubscriber error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAlias(aliasMercadoPago: string) {
  try {
    const cleanAlias = aliasMercadoPago.trim();
    await prisma.settings.upsert({
      where: { id: 'global_config' },
      update: { aliasMercadoPago: cleanAlias },
      create: { id: 'global_config', aliasMercadoPago: cleanAlias }
    });
    
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Action updateAlias error:", error);
    return { success: false, error: error.message };
  }
}

export async function addSubscriber(data: { name: string; email: string; whatsapp: string; months: number }) {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + data.months);

    await prisma.subscriber.create({
      data: {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        startDate,
        endDate,
        status: 'active'
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error("Action addSubscriber error:", error);
    return { success: false, error: error.message };
  }
}
