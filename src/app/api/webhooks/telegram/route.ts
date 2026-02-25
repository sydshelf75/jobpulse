import { NextRequest, NextResponse } from "next/server";
import { chat, type ChatMessage } from "@/lib/claude";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
    try {
        const update = await req.json();

        const chatId = String(update?.message?.chat?.id || "");
        const messageText = update?.message?.text || "";

        if (!chatId || !messageText) {
            return NextResponse.json({ error: "Missing message data" }, { status: 400 });
        }

        // Process with Claude AI
        const messages: ChatMessage[] = [{ role: "user", content: messageText }];
        const aiResponse = await chat(messages);

        // Send reply via Telegram
        await sendTelegramMessage(chatId, aiResponse);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("[Telegram Webhook Error]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ status: "Telegram webhook active" });
}
