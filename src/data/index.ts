export type QuoteRequest = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  pickupCountry: string;
  importCountry: string;
  pickupCity: string;
  serviceType: "Air Freight" | "Sea Freight" | "Land Freight" | "Express" | "Warehousing";
  details: string;
  status: "new" | "pending" | "reviewed" | "closed";
  createdAt: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

const services: QuoteRequest["serviceType"][] = ["Air Freight", "Sea Freight", "Land Freight", "Express", "Warehousing"];
const statuses: QuoteRequest["status"][] = ["new", "pending", "reviewed", "closed"];
const countries = ["Turkey", "Germany", "UAE", "Saudi Arabia", "Egypt", "France", "China", "USA", "UK", "Italy"];
const cities: Record<string, string[]> = {
  Turkey: ["Mersin", "Istanbul", "Izmir"],
  Germany: ["Berlin", "Hamburg", "Munich"],
  UAE: ["Dubai", "Abu Dhabi"],
  "Saudi Arabia": ["Riyadh", "Jeddah"],
  Egypt: ["Cairo", "Alexandria"],
  France: ["Paris", "Marseille"],
  China: ["Shanghai", "Shenzhen"],
  USA: ["New York", "Los Angeles"],
  UK: ["London", "Manchester"],
  Italy: ["Rome", "Milan"],
};
const firstNames = ["Ahmed", "Sara", "John", "Maria", "Omar", "Layla", "David", "Fatima", "Mohammed", "Emma", "Yusuf", "Hannah", "Ali", "Sophie", "Khaled"];
const lastNames = ["Hassan", "Khan", "Smith", "Garcia", "Erdogan", "Brown", "Ali", "Müller", "Rossi", "Dubois", "Cohen", "Yilmaz"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const quoteRequests: QuoteRequest[] = Array.from({ length: 38 }, (_, i) => {
  const fn = pick(firstNames, i * 3);
  const ln = pick(lastNames, i * 5);
  const pc = pick(countries, i);
  const ic = pick(countries, i + 3);
  return {
    id: `Q-${1000 + i}`,
    fullName: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
    phone: `+90 5${pad((i * 17) % 100)} ${pad((i * 31) % 1000).slice(0, 3)} ${pad((i * 53) % 100)}${pad((i * 23) % 100)}`,
    pickupCountry: pc,
    importCountry: ic,
    pickupCity: pick(cities[pc] || ["—"], i),
    serviceType: pick(services, i),
    details: `Shipment of ${10 + ((i * 7) % 90)} pallets, ${(2 + (i % 8)).toFixed(1)} tons total. Handle with care.`,
    status: pick(statuses, i),
    createdAt: dateStr(i),
  };
});

const messages = [
  "Hi, I'd like to know more about your air freight rates to Dubai.",
  "Could you call me back regarding a recurring shipment from Mersin?",
  "Looking for a long-term warehousing partner in Turkey.",
  "Need urgent quotation for express delivery to Riyadh.",
  "Is land freight available between Istanbul and Berlin?",
  "Please share your service catalogue.",
  "Interested in customs clearance services.",
  "We need a partner for our European distribution.",
];

export const contactRequests: ContactRequest[] = Array.from({ length: 24 }, (_, i) => {
  const fn = pick(firstNames, i * 2 + 1);
  const ln = pick(lastNames, i * 4 + 2);
  return {
    id: `C-${2000 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}@mail.com`,
    phone: `+90 5${pad((i * 13) % 100)} ${pad((i * 29) % 1000).slice(0, 3)} ${pad((i * 47) % 100)}${pad((i * 19) % 100)}`,
    message: pick(messages, i),
    createdAt: dateStr(i),
  };
});

export const totalUsers = 1284;

export const monthlyTrend = [
  { month: "Jan", quotes: 42, contacts: 28 },
  { month: "Feb", quotes: 51, contacts: 33 },
  { month: "Mar", quotes: 47, contacts: 41 },
  { month: "Apr", quotes: 63, contacts: 38 },
  { month: "May", quotes: 72, contacts: 49 },
  { month: "Jun", quotes: 68, contacts: 52 },
  { month: "Jul", quotes: 81, contacts: 60 },
  { month: "Aug", quotes: 76, contacts: 55 },
  { month: "Sep", quotes: 89, contacts: 64 },
  { month: "Oct", quotes: 94, contacts: 71 },
  { month: "Nov", quotes: 102, contacts: 78 },
  { month: "Dec", quotes: 118, contacts: 84 },
];

export const serviceSplit = services.map((s) => ({
  name: s,
  value: quoteRequests.filter((q) => q.serviceType === s).length,
}));

export type ContactInfoItem = {
  id: string;
  key: "phone" | "email" | "location" | "hours";
  value: string;
  description: string;
};

export const initialContactInfo: ContactInfoItem[] = [
  { id: "phone", key: "phone", value: "+90 552 797 77 72", description: "لا تتردد في الاتصال بنا" },
  { id: "email", key: "email", value: "info@megtlogistics.com", description: "للاستفسارات العامة" },
  { id: "location", key: "location", value: "Mersin, Turkey", description: "زيارة مقرنا الرئيسي" },
  { id: "hours", key: "hours", value: "Mon - Fri: 09:00 - 18:00", description: "من الاثنين إلى الجمعة" },
];

export const activityFeed = [
  { id: 1, type: "quote", text: "New quote from Ahmed Hassan", time: "2m ago" },
  { id: 2, type: "contact", text: "Sara Khan sent a message", time: "18m ago" },
  { id: 3, type: "user", text: "12 new users signed up today", time: "1h ago" },
  { id: 4, type: "quote", text: "Quote Q-1023 marked as reviewed", time: "3h ago" },
  { id: 5, type: "contact", text: "Yusuf Ali requested a callback", time: "5h ago" },
  { id: 6, type: "quote", text: "New quote from Maria Garcia", time: "Yesterday" },
];
