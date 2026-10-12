import { NextRequest, NextResponse } from "next/server";
import { INITIAL_CONVERSATIONS, ChatConversation, ChatMessage } from "@/lib/chat-data";

let memoryConversations: ChatConversation[] = [...INITIAL_CONVERSATIONS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (conversationId) {
    const conv = memoryConversations.find((c) => c.id === conversationId);
    if (!conv) {
      return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: conv });
  }

  // Return all conversations sorted by latest message
  const sorted = [...memoryConversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return NextResponse.json({ success: true, count: sorted.length, data: sorted });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Action: Start or find existing conversation for an item (OpenSooq style)
    if (action === "start") {
      const { itemId, itemTitle, itemPrice, itemImage, itemCity, sellerPhone, buyerPhone, initialText } = body;

      if (!itemId || !itemTitle) {
        return NextResponse.json({ error: "بيانات الإعلان ناقصة" }, { status: 400 });
      }

      // Check if conversation already exists for this item and buyer
      let existing = memoryConversations.find(
        (c) => c.itemId === itemId && c.sellerPhone === sellerPhone
      );

      if (!existing) {
        const newConvId = `conv-${Date.now()}`;
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId: newConvId,
          senderPhone: buyerPhone || "0790001122",
          senderName: "فني عمان (أنت)",
          text: initialText || `مرحباً، أنا مهتم بـ (${itemTitle}) المعروضة لديك بسعر ${itemPrice || 0} د.أ. هل ما زالت متوفرة؟`,
          isRead: false,
          createdAt: new Date().toISOString()
        };

        existing = {
          id: newConvId,
          itemType: "board",
          itemId,
          itemTitle,
          itemPrice: itemPrice ? Number(itemPrice) : undefined,
          itemImage: itemImage || "",
          itemCity: itemCity || "عمان",
          buyerPhone: buyerPhone || "0790001122",
          sellerPhone: sellerPhone || "0791234567",
          lastMessage: newMsg.text,
          lastMessageAt: newMsg.createdAt,
          messages: [newMsg]
        };

        memoryConversations.unshift(existing);
      }

      return NextResponse.json({ success: true, data: existing });
    }

    // 2. Action: Send message inside existing conversation
    const { conversationId, text, senderPhone, senderName, imageUrl } = body;

    if (!conversationId || (!text && !imageUrl)) {
      return NextResponse.json({ error: "الرجاء كتابة نص الرسالة" }, { status: 400 });
    }

    const convIndex = memoryConversations.findIndex((c) => c.id === conversationId);
    if (convIndex === -1) {
      return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderPhone: senderPhone || "0790001122",
      senderName: senderName || "فني عمان (أنت)",
      text: text || "",
      imageUrl: imageUrl || undefined,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    memoryConversations[convIndex].messages.push(newMessage);
    memoryConversations[convIndex].lastMessage = text || "صورة مرفقة 📷";
    memoryConversations[convIndex].lastMessageAt = newMessage.createdAt;

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل إرسال الرسالة", details: String(err) }, { status: 500 });
  }
}
