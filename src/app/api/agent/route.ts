import { NextRequest, NextResponse } from "next/server";

export interface AgentMessage {
  role: "user" | "model";
  content: string;
}

export interface AgentAction {
  type: string;
  data: Record<string, unknown>;
  result?: string;
}

let vaultStore: Array<{
  id: string;
  customerName: string;
  customerPhone: string;
  imei: string;
  deviceModel: string;
  faultDesc: string;
  status: string;
  priceJOD?: number;
  date: string;
}> = [];

async function fetchVaultData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/vault`, { cache: "no-store" });
    const json = await res.json();
    if (json.data) vaultStore = json.data;
  } catch {
    // offline fallback
  }
}

const TOOL_DECLARATIONS = [
  {
    name: "getDevice",
    description: "يجلب معلومات جهاز من خزنة الزبائن بواسطة اسم الزبون أو الـ IMEI أو ID الجهاز.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "اسم الزبون أو الـ IMEI أو ID الجهاز" },
      },
      required: ["query"],
    },
  },
  {
    name: "updateDeviceStatus",
    description: "يغيّر حالة الجهاز في الخزنة. القيم: RECEIVED, IN_PROGRESS, DONE, DELIVERED",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID الجهاز" },
        status: {
          type: "string",
          enum: ["RECEIVED", "IN_PROGRESS", "DONE", "DELIVERED"],
          description: "الحالة الجديدة",
        },
      },
      required: ["id", "status"],
    },
  },
  {
    name: "listPendingDevices",
    description: "يجلب قائمة الأجهزة المعلقة التي لم تُسلَّم بعد (RECEIVED أو IN_PROGRESS أو DONE).",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "sendWhatsAppMessage",
    description: "يُنشئ رابط واتساب مخصص لإرسال رسالة جاهزة للزبون.",
    parameters: {
      type: "object",
      properties: {
        phone: { type: "string", description: "رقم هاتف الزبون الأردني (مثلاً 0791234567)" },
        message: { type: "string", description: "نص الرسالة" },
      },
      required: ["phone", "message"],
    },
  },
  {
    name: "getDailyReport",
    description: "يُعطي تقريراً يومياً شاملاً عن حالة المحل والأجهزة والأرباح المتوقعة.",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "searchByIMEI",
    description: "يبحث عن جهاز بالـ IMEI بدقة في الخزنة.",
    parameters: {
      type: "object",
      properties: {
        imei: { type: "string", description: "رقم الـ IMEI المكون من 15 خانة" },
      },
      required: ["imei"],
    },
  },
];

function statusLabel(status: string) {
  switch (status) {
    case "RECEIVED": return "📥 تم الاستلام";
    case "IN_PROGRESS": return "⚙️ قيد الإصلاح";
    case "DONE": return "✅ جاهز للاستلام";
    case "DELIVERED": return "🤝 تم التسليم";
    default: return status;
  }
}

async function executeTool(
  name: string,
  args: Record<string, string>
): Promise<{ result: string; action?: AgentAction }> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  switch (name) {
    case "getDevice": {
      const q = args.query?.toLowerCase() || "";
      const found = vaultStore.filter(
        (d) =>
          d.customerName?.toLowerCase().includes(q) ||
          d.imei?.includes(q) ||
          d.id === q ||
          d.deviceModel?.toLowerCase().includes(q)
      );
      if (found.length === 0) return { result: "لم أجد أي جهاز بهذا الاسم أو الرقم في الخزنة." };
      const items = found
        .map(
          (d) =>
            `• ${d.deviceModel} | الزبون: ${d.customerName} (${d.customerPhone || "بدون هاتف"}) | الـ IMEI: ${d.imei} | الحالة: ${statusLabel(d.status)} | التكلفة: ${d.priceJOD || 0} د.أ | المعرف: ${d.id}`
        )
        .join("\n");
      return { result: `وجدت ${found.length} جهاز مسجل:\n${items}` };
    }

    case "updateDeviceStatus": {
      try {
        const res = await fetch(`${baseUrl}/api/vault`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: args.id, status: args.status }),
          cache: "no-store",
        });
        if (!res.ok) return { result: "فشل تحديث الحالة في الخزنة، يرجى التأكد من المعرف." };
        const dev = vaultStore.find((d) => d.id === args.id);
        const idx = vaultStore.findIndex((d) => d.id === args.id);
        if (idx !== -1) vaultStore[idx].status = args.status;

        const customerPhone = dev?.customerPhone;
        let waLink = "";
        if (args.status === "DONE" && customerPhone) {
          const cleanPhone = customerPhone.replace(/^0/, "").replace(/\D/g, "");
          const msg = `مرحباً ${dev.customerName}، نبشرك بأن جهازك (${dev.deviceModel}) أصبح جاهزاً للاستلام في محل عالم الصيانة. التكلفة: ${dev.priceJOD || 0} د.أ. أهلاً بك!`;
          waLink = `https://wa.me/962${cleanPhone}?text=${encodeURIComponent(msg)}`;
        }

        return {
          result: `✅ تم تحديث حالة جهاز (${dev?.deviceModel || args.id}) بنجاح إلى "${statusLabel(args.status)}"${waLink ? "\n📲 تم تجهيز رابط واتساب لإشعار الزبون مباشرة." : ""}`,
          action: {
            type: "STATUS_UPDATE",
            data: { id: args.id, status: args.status, deviceModel: dev?.deviceModel, waLink, customerPhone },
            result: "success",
          },
        };
      } catch {
        return { result: "حدث خطأ أثناء الاتصال بالخزنة." };
      }
    }

    case "listPendingDevices": {
      const pending = vaultStore.filter((d) => d.status !== "DELIVERED");
      if (pending.length === 0)
        return { result: "🎉 لا توجد أجهزة معلقة حالياً، كل الأجهزة مسلّمة بالكامل!" };
      const list = pending
        .map(
          (d) =>
            `• [${statusLabel(d.status)}] ${d.deviceModel} — الزبون: ${d.customerName} (${d.customerPhone || "بدون هاتف"}) | السعر: ${d.priceJOD || 0} د.أ | ID: ${d.id}`
        )
        .join("\n");
      return {
        result: `يوجد حالياً ${pending.length} جهاز قيد الانتظار والإصلاح:\n${list}`,
        action: { type: "LIST_PENDING", data: { count: pending.length }, result: "success" },
      };
    }

    case "sendWhatsAppMessage": {
      const cleanPhone = args.phone?.replace(/^0/, "").replace(/\D/g, "");
      const url = `https://wa.me/962${cleanPhone}?text=${encodeURIComponent(args.message)}`;
      return {
        result: `جاهز! تم إعداد رابط رسالة الواتساب للرقم (${args.phone}). يمكنك الضغط على زر الإرسال بالأسفل.`,
        action: { type: "WHATSAPP_LINK", data: { url, phone: args.phone, message: args.message } },
      };
    }

    case "getDailyReport": {
      const total = vaultStore.length;
      const received = vaultStore.filter((d) => d.status === "RECEIVED").length;
      const inProgress = vaultStore.filter((d) => d.status === "IN_PROGRESS").length;
      const done = vaultStore.filter((d) => d.status === "DONE").length;
      const delivered = vaultStore.filter((d) => d.status === "DELIVERED").length;
      const revenue = vaultStore
        .filter((d) => d.status === "DONE" || d.status === "DELIVERED")
        .reduce((s, d) => s + (d.priceJOD || 0), 0);
      return {
        result: `📊 **تقرير أداء الورشة اليوم:**\n• إجمالي الأجهزة بالخزنة: ${total}\n• بانتظار الفحص (مستلمة): ${received}\n• قيد الصيانة والإصلاح: ${inProgress}\n• جاهزة للاستلام فوراً: ${done}\n• تم تسليمها للزبائن: ${delivered}\n• الإيراد المالي المتوقع/المحقق: ${revenue} دينار أردني 💰`,
        action: {
          type: "DAILY_REPORT",
          data: { total, received, inProgress, done, delivered, revenue },
        },
      };
    }

    case "searchByIMEI": {
      const found = vaultStore.find((d) => d.imei === args.imei.trim());
      if (!found) return { result: `لم يتم العثور على أي جهاز برقم الـ IMEI: ${args.imei}` };
      return {
        result: `🔍 **بيانات الجهاز من الخزنة:**\n• الموديل: ${found.deviceModel}\n• صاحب الجهاز: ${found.customerName} (${found.customerPhone || "بدون هاتف"})\n• رقم الـ IMEI: ${found.imei}\n• حالة الجهاز: ${statusLabel(found.status)}\n• وصف العطل المسجل: ${found.faultDesc}\n• التكلفة: ${found.priceJOD || 0} د.أ\n• معرف السجل: ${found.id}`,
      };
    }

    default:
      return { result: `الأداة "${name}" غير متوفرة.` };
  }
}

function smartLocalEngine(userMessage: string): { text: string; actions: AgentAction[] } {
  const msg = userMessage.toLowerCase().trim();
  const actions: AgentAction[] = [];

  // Match report
  if (msg.includes("تقرير") || msg.includes("يوم") || msg.includes("أرباح") || msg.includes("دخل") || msg.includes("احصائيات")) {
    const total = vaultStore.length;
    const received = vaultStore.filter((d) => d.status === "RECEIVED").length;
    const inProgress = vaultStore.filter((d) => d.status === "IN_PROGRESS").length;
    const done = vaultStore.filter((d) => d.status === "DONE").length;
    const delivered = vaultStore.filter((d) => d.status === "DELIVERED").length;
    const revenue = vaultStore.reduce((s, d) => s + (d.priceJOD || 0), 0);
    return {
      text: `📊 **تقرير ورشة عالم الصيانة:**\n\n• إجمالي الأجهزة: **${total}**\n• قيد الفحص والإصلاح: **${inProgress + received}**\n• جاهزة بانتظار الزبون: **${done}**\n• تم تسليمها: **${delivered}**\n• الإيراد المقدر: **${revenue} د.أ** 💰\n\nالمحل شغال بأعلى كفاءة يا معلم! 🚀`,
      actions: [{ type: "DAILY_REPORT", data: { total, received, inProgress, done, delivered, revenue } }],
    };
  }

  // Match pending
  if (msg.includes("معلق") || msg.includes("جاهز") || msg.includes("انتظار") || msg.includes("وين الاجهزة") || msg.includes("الأجهزة")) {
    const pending = vaultStore.filter((d) => d.status !== "DELIVERED");
    const ready = vaultStore.filter((d) => d.status === "DONE");
    let txt = `عندك **${pending.length} جهاز** غير مسلّم في الورشة:\n\n`;
    pending.forEach((d) => {
      txt += `• **${d.deviceModel}** (${d.customerName}) — ${statusLabel(d.status)}\n`;
    });
    if (ready.length > 0) {
      txt += `\n💡 نصيحة: عندك ${ready.length} جهاز مكتمل، تقدر تضغط "إشعار الزبائن الجاهزين" بالأسفل ليرسل لهم واتساب فوراً!`;
    }
    return { text: txt, actions };
  }

  // Match customer / device query
  for (const d of vaultStore) {
    if (msg.includes(d.customerName.toLowerCase()) || msg.includes(d.deviceModel.toLowerCase()) || (d.imei && msg.includes(d.imei))) {
      let waLink = "";
      if (d.customerPhone) {
        const clean = d.customerPhone.replace(/^0/, "").replace(/\D/g, "");
        const waMsg = `مرحباً ${d.customerName}، معك محل عالم الصيانة بخصوص جهازك (${d.deviceModel}): حالة الجهاز الحالية هي [${statusLabel(d.status)}].`;
        waLink = `https://wa.me/962${clean}?text=${encodeURIComponent(waMsg)}`;
        actions.push({
          type: "WHATSAPP_LINK",
          data: { url: waLink, phone: d.customerPhone, message: waMsg },
        });
      }
      return {
        text: `📱 **وجدت جهاز ${d.customerName}:**\n• الموديل: **${d.deviceModel}**\n• الـ IMEI: \`${d.imei}\`\n• الحالة الحالية: **${statusLabel(d.status)}**\n• العطل: ${d.faultDesc}\n• الاتفاق: ${d.priceJOD || 0} د.أ${waLink ? "\n\n📲 زر مراسلته عبر واتساب جاهز أدناه." : ""}`,
        actions,
      };
    }
  }

  // Match greetings
  if (msg.includes("مرحبا") || msg.includes("هلا") || msg.includes("السلام") || msg.includes("صباح") || msg.includes("مساء")) {
    return {
      text: `أهلاً وسهلاً يا معلم! 👋 أنا **عامر**، الموظف الذكي المخصص لورشة الصيانة الخاصة بك.\n\nأنا مربوط مع الخزنة والنظام والواتساب، وأقدر أنفّذ لك أي مهمة مثل:\n• "اعطيني تقرير اليوم"\n• "شو الأجهزة الجاهزة؟"\n• "وين جهاز محمد العمري؟"\n• "غيّر حالة جهاز محمد لـ جاهز للاستلام"\n• "ابعث واتساب للزبائن الجاهزين"\n\nجاهز لأي أمر! 🤖⚡`,
      actions: [],
    };
  }

  // Default fallback with helpful action
  return {
    text: `أهلاً بك! لقد فهمت طلبك بخصوص "${userMessage}".\n\nأنا متصل بالخزنة الآن. يمكنك سؤالي عن أي جهاز بالاسم أو الموديل أو الـ IMEI، أو طلب تقرير فوري، أو أمر لتحديث حالة أي جهاز وإشعار الزبون فوراً على الواتساب.`,
    actions: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    await fetchVaultData();

    const body = await req.json();
    const { messages = [], userMessage } = body as {
      messages: AgentMessage[];
      userMessage: string;
    };

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    }

    const allMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];

    const apiKey = process.env.GEMINI_API_KEY;
    const hasRealKey =
      apiKey &&
      apiKey !== "YOUR_GEMINI_API_KEY_HERE" &&
      apiKey.length > 20;

    // Direct execution via smart engine if no real key yet
    if (!hasRealKey) {
      // Check if user requested an explicit status change
      const low = userMessage.toLowerCase();
      if ((low.includes("حول") || low.includes("غير") || low.includes("حط") || low.includes("خليه")) && (low.includes("جاهز") || low.includes("done"))) {
        for (const dev of vaultStore) {
          if (low.includes(dev.customerName.toLowerCase()) || low.includes(dev.deviceModel.toLowerCase())) {
            const resTool = await executeTool("updateDeviceStatus", { id: dev.id, status: "DONE" });
            return NextResponse.json({
              success: true,
              response: resTool.result,
              actions: resTool.action ? [resTool.action] : [],
              mode: "local_engine",
            });
          }
        }
      }

      const localResult = smartLocalEngine(userMessage);
      return NextResponse.json({
        success: true,
        response: localResult.text,
        actions: localResult.actions,
        mode: "local_engine",
      });
    }

    // REAL GEMINI TOOL CALLING
    const systemInstruction = `أنت "عامر"، الوكيل والمدير الذكي لمحل عالم الصيانة في عمان - الأردن.
صلاحياتك ومسؤولياتك:
1. أنت متصل مباشرة بخزنة الأجهزة (Vault) وسوق الدراج وخدمة واتساب.
2. تستطيع استخدام الأدوات للبحث عن الأجهزة وتحديث حالتها وإصدار روابط واتساب وإعطاء تقارير.
3. تحدث باللغة العربية الأردنية المحكية المهذبة والمشجعة (يا معلم، هلا، أمرك، شغلتك نظيفة).
4. بعد تنفيذ أي أداة بنجاح، وضح للفني الخطوة التي تمت بدقة.
الأجهزة المسجلة بالخزنة حالياً: ${vaultStore.length} جهاز.`;

    const geminiContents = allMessages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: geminiContents,
          tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
          toolConfig: { functionCallingConfig: { mode: "AUTO" } },
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!geminiRes.ok) {
      // Fallback to local engine smoothly if Gemini API limits or errors out
      const localResult = smartLocalEngine(userMessage);
      return NextResponse.json({
        success: true,
        response: localResult.text,
        actions: localResult.actions,
        mode: "local_engine_fallback",
      });
    }

    const geminiData = await geminiRes.json();
    const candidate = geminiData.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const performedActions: AgentAction[] = [];
    const functionCallParts = parts.filter((p: { functionCall?: unknown }) => p.functionCall);

    if (functionCallParts.length > 0) {
      const toolResultsParts = [];
      for (const part of functionCallParts) {
        const fc = part.functionCall as { name: string; args: Record<string, string> };
        const { result, action } = await executeTool(fc.name, fc.args || {});
        if (action) performedActions.push(action);
        toolResultsParts.push({
          functionResponse: {
            name: fc.name,
            response: { content: result },
          },
        });
      }

      const secondRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [
              ...geminiContents,
              { role: "model", parts },
              { role: "user", parts: toolResultsParts },
            ],
            tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
          }),
        }
      );

      const secondData = await secondRes.json();
      const finalText =
        secondData.candidates?.[0]?.content?.parts
          ?.filter((p: { text?: string }) => p.text)
          ?.map((p: { text: string }) => p.text)
          ?.join("") || "تم إنجاز المهمة بنجاح ✅";

      return NextResponse.json({
        success: true,
        response: finalText,
        actions: performedActions,
        mode: "gemini",
      });
    }

    const textResponse = parts
      .filter((p: { text?: string }) => p.text)
      .map((p: { text: string }) => p.text)
      .join("");

    return NextResponse.json({
      success: true,
      response: textResponse || "أمرك يا معلم، أنا بالخدمة!",
      actions: performedActions,
      mode: "gemini",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "خطأ داخلي في الخادم", details: String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasKey =
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE";
  return NextResponse.json({
    success: true,
    agent: "عامر - الوكيل الذكي لعالم الصيانة",
    connected: true,
    mode: hasKey ? "gemini" : "local_smart_engine",
  });
}
