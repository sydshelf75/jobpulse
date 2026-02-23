import { NextRequest, NextResponse } from "next/server";
import { chat, type ChatMessage } from "@/lib/claude";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
    try {
        const body = await req.formData ? await req.json().catch(() => null) : null;
        const contentType = req.headers.get("content-type") || "";

        let from = "";
        let messageBody = "";

        if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            from = formData.get("From") as string || "";
            messageBody = formData.get("Body") as string || "";
        } else if (body) {
            from = body.From || body.from || "";
            messageBody = body.Body || body.body || "";
        }

        if (!from || !messageBody) {
            return NextResponse.json({ error: "Missing From or Body" }, { status: 400 });
        }

        // Process with Claude AI
        const messages: ChatMessage[] = [{ role: "user", content: messageBody }];
        const aiResponse = await chat(messages);

        // Send reply via WhatsApp
        await sendWhatsAppMessage(from, aiResponse);

        // Return TwiML response for Twilio compatibility
        return new NextResponse(
            `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
            { headers: { "Content-Type": "text/xml" } }
        );
    } catch (error) {
        console.error("[WhatsApp Webhook Error]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// Verification endpoint for webhook setup
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ status: "WhatsApp webhook active" });
}
