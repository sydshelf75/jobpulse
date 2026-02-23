import { NextRequest, NextResponse } from "next/server";
import { chat, type ChatMessage } from "@/lib/claude";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const messages: ChatMessage[] = [
        ...history.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
        })),
        { role: "user" as const, content: message },
    ];

    const response = await chat(messages);

    return NextResponse.json({
        reply: response,
        timestamp: new Date().toISOString(),
    });
}
