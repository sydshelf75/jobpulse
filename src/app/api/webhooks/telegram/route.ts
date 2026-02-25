import { NextRequest, NextResponse } from "next/server";
import { chat, type ChatMessage, type UserContext } from "@/lib/claude";
import { sendTelegramMessage } from "@/lib/telegram";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const update = await req.json();

        const chatId = String(update?.message?.chat?.id || "");
        const messageText = update?.message?.text || "";

        if (!chatId || !messageText) {
            // Always return 200 to Telegram — even for non-text updates
            return NextResponse.json({ ok: true });
        }

        // Look up user by Telegram chat ID to inject context
        const user = await db.user.findUnique({
            where: { telegramChatId: chatId },
            select: {
                preferredRole: true,
                skills: true,
                experienceLevel: true,
                preferredLocation: true,
                salaryMin: true,
                salaryMax: true,
                jobTypes: true,
                resumeText: true,
            },
        });

        let userContext: UserContext | undefined;
        if (user) {
            const profileParts: string[] = [];
            if (user.preferredRole) profileParts.push(`Role: ${user.preferredRole}`);
            if (user.experienceLevel) profileParts.push(`Experience: ${user.experienceLevel}`);
            if (user.skills?.length) profileParts.push(`Skills: ${user.skills.join(", ")}`);
            if (user.preferredLocation) profileParts.push(`Location: ${user.preferredLocation}`);
            if (user.salaryMin || user.salaryMax) {
                profileParts.push(`Salary: ₹${user.salaryMin ?? "?"} – ₹${user.salaryMax ?? "?"} LPA`);
            }
            if (user.jobTypes?.length) profileParts.push(`Job types: ${user.jobTypes.join(", ")}`);

            userContext = {
                userProfile: profileParts.length ? profileParts.join("\n") : undefined,
                resume: user.resumeText ?? undefined,
            };
        }

        // Process with Claude AI
        const messages: ChatMessage[] = [{ role: "user", content: messageText }];
        const aiResponse = await chat(messages, userContext);

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
