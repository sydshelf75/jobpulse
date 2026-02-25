import { NextRequest, NextResponse } from "next/server";
import { chat, type ChatMessage, type UserContext } from "@/lib/claude";
import { sendTelegramMessage } from "@/lib/telegram";
import { db } from "@/lib/db";
import { searchAllPlatforms, formatJobsForClaude } from "@/lib/scraper";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const EXTRACT_API = "https://santaai-production-fba8.up.railway.app/extract";

async function downloadTelegramFile(fileId: string): Promise<Blob | null> {
    try {
        // Step 1: Get file path from Telegram
        const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json() as { ok: boolean; result: { file_path: string } };
        if (!fileData.ok) return null;

        // Step 2: Download the file
        const downloadRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`);
        if (!downloadRes.ok) return null;

        return await downloadRes.blob();
    } catch {
        return null;
    }
}

async function handlePdfUpload(chatId: string, fileId: string, fileName: string): Promise<string> {
    await sendTelegramMessage(chatId, "📄 Got your resume! Extracting text...");

    // Download from Telegram
    const fileBlob = await downloadTelegramFile(fileId);
    if (!fileBlob) {
        return "❌ Couldn't download the file. Please try again.";
    }

    // Send to santaai extraction API
    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
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

function isJobSearchIntent(text: string): boolean {
    const lower = text.toLowerCase();
    return ['find job', 'search job', 'show job', 'job for me', 'hiring', 'opening',
        'vacancy', 'role', 'position', 'work', 'apply', 'naukri', 'linkedin',
        'get job', 'job list', 'available job', 'fresher', 'internship'].some(k => lower.includes(k));
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

        // Load conversation history from DB
        const conversation = await db.conversation.findFirst({
            where: { channel: "telegram", user: { telegramChatId: chatId } },
            orderBy: { updatedAt: "desc" },
        });
        const history: ChatMessage[] = conversation ? (conversation.messages as unknown as ChatMessage[]) : [];

        // Build messages array including history (last 10 messages max)
        const recentHistory = history.slice(-10);
        const messages: ChatMessage[] = [...recentHistory, { role: "user", content: messageText }];

        // Find or create user — single query reused for both context and conversation save
        let dbUser = await db.user.findUnique({
            where: { telegramChatId: chatId },
            select: {
                id: true,
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
        if (!dbUser) {
            dbUser = await db.user.create({
                data: { telegramChatId: chatId },
                select: {
                    id: true,
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
        }

        // Build user context from the single user query
        let userContext: UserContext | undefined;
        const profileParts: string[] = [];
        if (dbUser.preferredRole) profileParts.push(`Role: ${dbUser.preferredRole}`);
        if (dbUser.experienceLevel) profileParts.push(`Experience: ${dbUser.experienceLevel}`);
        if (dbUser.skills?.length) profileParts.push(`Skills: ${dbUser.skills.join(", ")}`);
        if (dbUser.preferredLocation) profileParts.push(`Location: ${dbUser.preferredLocation}`);
        if (dbUser.salaryMin || dbUser.salaryMax) {
            profileParts.push(`Salary: ₹${dbUser.salaryMin ?? "?"} – ₹${dbUser.salaryMax ?? "?"} LPA`);
        }
        if (dbUser.jobTypes?.length) profileParts.push(`Job types: ${dbUser.jobTypes.join(", ")}`);

        if (profileParts.length || dbUser.resumeText) {
            userContext = {
                userProfile: profileParts.length ? profileParts.join("\n") : undefined,
                resume: dbUser.resumeText ?? undefined,
            };
        }

        // Fetch live jobs if message indicates job search intent
        let jobContext = '';
        if (isJobSearchIntent(messageText) && dbUser) {
            try {
                const query = dbUser.preferredRole ?? messageText;
                const jobs = await searchAllPlatforms(query, dbUser.preferredLocation ?? undefined);
                if (jobs.length > 0) {
                    jobContext = `\n\n--- Live Job Listings (fetched right now) ---\n${formatJobsForClaude(jobs)}\n---\nPresent these jobs to the user. Include the apply links. Do not say you cannot access the internet — these jobs were fetched for you.`;
                }
            } catch (e) {
                console.error('JSearch fetch failed:', e);
            }
        }

        if (jobContext && userContext) {
            userContext.userProfile = (userContext.userProfile ?? '') + jobContext;
        } else if (jobContext) {
            userContext = { userProfile: jobContext };
        }

        // Process with Claude AI
        const aiResponse = await chat(messages, userContext);

        // Save/update conversation in DB
        const updatedMessages = [
            ...recentHistory,
            { role: "user", content: messageText },
            { role: "assistant", content: aiResponse },
        ];
        if (conversation) {
            await db.conversation.update({
                where: { id: conversation.id },
                data: { messages: updatedMessages, updatedAt: new Date() },
            });
        } else {
            await db.conversation.create({
                data: { userId: dbUser.id, channel: "telegram", messages: updatedMessages },
            });
        }

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
