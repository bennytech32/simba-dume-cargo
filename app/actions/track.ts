"use server";

import prisma from '../../lib/prisma';

export async function trackShipment(formData: FormData) {
  const trackingNumber = formData.get('trackingNumber') as string;

  if (!trackingNumber) {
    return { error: "Tafadhali weka namba ya mzigo." };
  }

  try {
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: trackingNumber },
      include: { originBranch: true, destBranch: true }
    });

    if (!shipment) {
      return { error: "Mzigo Haujapatikana! Hakikisha namba ni sahihi." };
    }

    // Tunasafisha (Serialize) data kabla ya kuituma kwenye Client
    // Hii inaondoa kile kosa la "Decimal objects are not supported"
    const safeShipment = {
      ...shipment,
      price: shipment.price ? Number(shipment.price) : 0,
      declaredValue: shipment.declaredValue ? Number(shipment.declaredValue) : null,
    };

    return { success: true, data: safeShipment };
  } catch (error) {
    console.error("Tracking Error:", error);
    return { error: "Hitilafu imetokea. Jaribu tena." };
  }
}