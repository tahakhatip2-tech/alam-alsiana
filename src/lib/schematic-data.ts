export interface BoardTrack {
  id: string;
  name: string;
  net: string;
  voltage: string;
  color: string;
  pathD: string;
  startPoint: { x: number; y: number; label: string };
  endPoint: { x: number; y: number; label: string };
}

export interface BoardModelConfig {
  id: string;
  name: string;
  brand: string;
  image: string;
  tracks: BoardTrack[];
}

export const INITIAL_BOARDS_CONFIG: BoardModelConfig[] = [
  {
    id: "a12",
    name: "Samsung Galaxy A12 (SM-A125F)",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    tracks: [
      {
        id: "tr-vbus-a12",
        name: "مسار الشحن الرئيسي VBUS (5V)",
        net: "VBUS_5V_IN",
        voltage: "5.0V",
        color: "#EF4444",
        pathD: "M 150 550 L 150 380 L 320 380 L 320 240",
        startPoint: { x: 150, y: 550, label: "سوكت الشحن Sub-FPC" },
        endPoint: { x: 320, y: 240, label: "آيسي الشحن S2MU106" },
      },
      {
        id: "tr-vsys-a12",
        name: "مسار فولتية النظام VSYS / VPH_PWR",
        net: "VPH_PWR",
        voltage: "3.7V - 4.2V",
        color: "#F59E0B",
        pathD: "M 320 240 L 450 240 L 450 180 L 580 180",
        startPoint: { x: 320, y: 240, label: "ملف الشحن L5001" },
        endPoint: { x: 580, y: 180, label: "آيسي الباور الرئيسي PMIC" },
      },
      {
        id: "tr-lcd-a12",
        name: "مسار إضاءة الشاشة LED_ANODE",
        net: "LED_A_30V",
        voltage: "20V - 30V",
        color: "#3B82F6",
        pathD: "M 580 400 L 680 400 L 680 520",
        startPoint: { x: 580, y: 400, label: "ديود وملف الإضاءة" },
        endPoint: { x: 680, y: 520, label: "كونكتر الشاشة LCD FPC" },
      },
    ],
  },
  {
    id: "a32",
    name: "Samsung Galaxy A32 (SM-A325F)",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&auto=format&fit=crop&q=80",
    tracks: [
      {
        id: "tr-vbus-a32",
        name: "خط VBUS إلى Sub-PMIC",
        net: "USB_VBUS",
        voltage: "5.0V - 9.0V",
        color: "#EF4444",
        pathD: "M 180 520 L 180 340 L 380 340",
        startPoint: { x: 180, y: 520, label: "كونكتر الفلاتة السفلية" },
        endPoint: { x: 380, y: 340, label: "آيسي MT6358W" },
      },
      {
        id: "tr-amoled-a32",
        name: "تغذية شاشة الأموليد VDD_EL",
        net: "AMOLED_ELVDD",
        voltage: "+4.6V / -4.0V",
        color: "#10B981",
        pathD: "M 380 340 L 500 340 L 500 480",
        startPoint: { x: 380, y: 340, label: "آيسي درايفر الأموليد" },
        endPoint: { x: 500, y: 480, label: "سوكت الشاشة" },
      },
    ],
  },
  {
    id: "note11",
    name: "Xiaomi Redmi Note 11 (2201117TG)",
    brand: "Xiaomi",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=1200&auto=format&fit=crop&q=80",
    tracks: [
      {
        id: "tr-vbus-rn11",
        name: "مسار الشحن السريع كوالكوم",
        net: "VBUS_QC",
        voltage: "5V / 9V / 11V",
        color: "#EF4444",
        pathD: "M 200 500 L 200 300 L 420 300",
        startPoint: { x: 200, y: 500, label: "مدخل Type-C" },
        endPoint: { x: 420, y: 300, label: "آيسي كوالكوم PM6225" },
      },
    ],
  },
];
