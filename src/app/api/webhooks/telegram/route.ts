import { NextRequest, NextResponse } from "next/server";
import { chat, type ChatMessage, type UserContext } from "@/lib/claude";
import { sendTelegramMessage } from "@/lib/telegram";
import { db } from "@/lib/db";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const EXTRACT_API = "https://santaai-production-fba8.up.railway.app/extract";

async function downloadTelegramFile(fileId: string): Promise<Buffer | null> {
    try {
        // Step 1: Get file path from Telegram
        const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json() as { ok: boolean; result: { file_path: string } };
        if (!fileData.ok) return null;

        // Step 2: Download the file
        const downloadRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`);
        if (!downloadRes.ok) return null;

        const arrayBuffer = await downloadRes.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch {
        return null;
    }
}

async function handlePdfUpload(chatId: string, fileId: string, fileName: string): Promise<string> {
    await sendTelegramMessage(chatId, "📄 Got your resume! Extracting text...");

    // Download from Telegram
    const fileBuffer = await downloadTelegramFile(fileId);
    if (!fileBuffer) {
        return "❌ Couldn't download the file. Please try again.";
    }

    // Send to santaai extraction API
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "application/pdf" });
    formData.append("file", blob, fileName);
    formData.append("file_type", "pdf");

    const extractRes = await fetch(EXTRACT_API, { method: "POST", body: formData });
    if (!extractRes.ok) {
        return "❌ Failed to extract text from PDF. Make sure it's a readable PDF (not scanned image).";
    }

    const extracted = await extractRes.json() as { success: boolean; text: string; metadata?: { char_count: number } };
    if (!extracted.success || !extracted.text?.trim()) {
        return "❌ Couldn't read the PDF content. Try a text-based PDF instead of a scanned image.";
    }

    // Save to DB — upsert by telegramChatId
    await db.user.upsert({
        where: { telegramChatId: chatId },
        update: {
            resumeText: extracted.text.trim(),
            resumeFileName: fileName,
            resumeUpdatedAt: new Date(),
        },
        create: {
            telegramChatId: chatId,
            resumeText: extracted.text.trim(),
            resumeFileName: fileName,
            resumeUpdatedAt: new Date(),
        },
    });

    const charCount = extracted.metadata?.char_count ?? extracted.text.length;
    return `✅ *Resume saved!* (${charCount.toLocaleString()} characters extracted)\n\nI'll now use your resume to match jobs and personalise every response. Send me a message like "find me jobs" to get started!`;
}

export async function POST(req: NextRequest) {
    try {
        const update = await req.json();

        const chatId = String(update?.message?.chat?.id || "");
        if (!chatId) return NextResponse.json({ ok: true });

        // Handle PDF document uploads
        const doc = update?.message?.document;
        if (doc) {
            if (doc.mime_type === "application/pdf") {
                const reply = await handlePdfUpload(chatId, doc.file_id, doc.file_name ?? "resume.pdf");
                await sendTelegramMessage(chatId, reply);
            } else {
                await sendTelegramMessage(chatId, "⚠️ Please send a *PDF* file for resume upload.");
            }
            return NextResponse.json({ ok: true });
        }

        const messageText = update?.message?.text || "";
        if (!messageText) return NextResponse.json({ ok: true });

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
