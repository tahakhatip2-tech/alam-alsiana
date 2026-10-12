export interface ChatMessage {
  id: string;
  conversationId: string;
  senderPhone: string;
  senderName: string;
  text: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  itemType: "board" | "wanted";
  itemId: string;
  itemTitle: string; // مثل السوق المفتوح: اسم المنتج
  itemPrice?: number;
  itemImage?: string;
  itemCity?: string;
  buyerPhone: string;
  sellerPhone: string;
  lastMessage?: string;
  lastMessageAt: string;
  messages: ChatMessage[];
}

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-101",
    itemType: "board",
    itemId: "brd-001",
    itemTitle: "Samsung Galaxy A12 (SM-A125F)",
    itemPrice: 10,
    itemImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    itemCity: "عمان",
    buyerPhone: "0790001122",
    sellerPhone: "0791234567",
    lastMessage: "هل آيسي الشحن S2MU106 أصلي 100% ومفحوص؟",
    lastMessageAt: "2025-05-12T15:20:00Z",
    messages: [
      {
        id: "msg-1",
        conversationId: "conv-101",
        senderPhone: "0790001122",
        senderName: "فني عمان (أنت)",
        text: "مرحباً يا غالي، بخصوص بوردة الـ A12 المعروضة عندك في سوق الدراج",
        isRead: true,
        createdAt: "2025-05-12T15:10:00Z"
      },
      {
        id: "msg-2",
        conversationId: "conv-101",
        senderPhone: "0791234567",
        senderName: "بائع اللوحة",
        text: "أهلاً وسهلاً، نعم البوردة موجودة والقطع المذكورة سليمة تماماً.",
        isRead: true,
        createdAt: "2025-05-12T15:15:00Z"
      },
      {
        id: "msg-3",
        conversationId: "conv-101",
        senderPhone: "0790001122",
        senderName: "فني عمان (أنت)",
        text: "هل آيسي الشحن S2MU106 أصلي 100% ومفحوص؟",
        isRead: true,
        createdAt: "2025-05-12T15:20:00Z"
      }
    ]
  },
  {
    id: "conv-102",
    itemType: "board",
    itemId: "brd-002",
    itemTitle: "Xiaomi Redmi Note 11",
    itemPrice: 15,
    itemImage: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60",
    itemCity: "إربد",
    buyerPhone: "0790001122",
    sellerPhone: "0788765432",
    lastMessage: "نعم متوفرة في إربد، ممكن نلتقي عند دوار القبة.",
    lastMessageAt: "2025-05-12T13:45:00Z",
    messages: [
      {
        id: "msg-201",
        conversationId: "conv-102",
        senderPhone: "0790001122",
        senderName: "فني عمان (أنت)",
        text: "السلام عليكم، بدي بوردة النوت 11 مشان آيسي باور كوالكوم PM6225",
        isRead: true,
        createdAt: "2025-05-12T13:30:00Z"
      },
      {
        id: "msg-202",
        conversationId: "conv-102",
        senderPhone: "0788765432",
        senderName: "بائع إربد",
        text: "نعم متوفرة في إربد، ممكن نلتقي عند دوار القبة.",
        isRead: true,
        createdAt: "2025-05-12T13:45:00Z"
      }
    ]
  }
];
