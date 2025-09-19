export function deviceTypeHuman(deviceType: string): string {
  switch ((deviceType || "").toLowerCase()) {
    case "çamaşır makinesi":
    case "washing_machine":
      return "Çamaşır Makinesi";
    case "bulaşık makinesi":
    case "dishwasher":
      return "Bulaşık Makinesi";
    case "buzdolabı":
    case "fridge":
      return "Buzdolabı";
    default:
      return deviceType;
  }
}

export function buildWaMessage(params: {
  device_type: string;
  brand: string;
  issue: string;
  region: string;
  phone?: string | null;
}) {
  const { device_type, brand, issue, region, phone } = params;
  return (
    `Merhaba, servis talebi:\n` +
    `- Cihaz: ${deviceTypeHuman(device_type)}\n` +
    `- Marka: ${brand}\n` +
    `- Şikayet: ${issue}\n` +
    `- Bölge: ${region}\n` +
    `- Telefon: ${phone || "Belirtilmedi"}`
  );
}

export function buildWaURL(phoneNumber: string, message: string) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}