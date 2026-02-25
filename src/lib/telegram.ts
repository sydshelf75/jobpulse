import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = token
    ? new TelegramBot(token)
    : null;

export async function sendTelegramMessage(
    chatId: string,
    text: string
): Promise<{ success: boolean; messageId?: number; error?: string }> {
    if (!bot) {
        console.log(`[Telegram Mock] To: ${chatId}\n${text}`);
        return { success: true, messageId: Date.now() };
    }

    try {
        const message = await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
        return { success: true, messageId: message.message_id };
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("[Telegram Error]", errMsg);
        return { success: false, error: errMsg };
    }
}

export function formatBriefing(data: {
    newJobs: { title: string; company: string; salary?: string }[];
    applications: { status: string; count: number }[];
    interviews: { company: string; role: string; time: string }[];
    trend?: string;
}): string {
    let msg = "☀️ *Good Morning! Here's your JobPulse Briefing:*\n\n";

    // New Jobs
    msg += "🔍 *New Jobs For You:*\n";
    if (data.newJobs.length > 0) {
        data.newJobs.forEach((job, i) => {
            msg += `${i + 1}. *${job.title}* — ${job.company}`;
            if (job.salary) msg += ` | 💰 ${job.salary}`;
            msg += "\n";
        });
    } else {
        msg += "No new matches today. I'll keep looking!\n";
    }

    // Application Status
    msg += "\n📊 *Application Status:*\n";
    data.applications.forEach((app) => {
        msg += `- ${app.status}: ${app.count}\n`;
    });

    // Interviews
    if (data.interviews.length > 0) {
        msg += "\n📅 *Upcoming Interviews:*\n";
        data.interviews.forEach((int) => {
            msg += `- *${int.role}* @ ${int.company} — ${int.time}\n`;
        });
    }

    // Market Trend
    if (data.trend) {
        msg += `\n📈 *Market Pulse:* ${data.trend}\n`;
    }

    msg += "\n_Reply to ask me anything about your job search!_";
    return msg;
}
