import twilio from "twilio";

const client =
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
        ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        : null;

const FROM_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

export async function sendWhatsAppMessage(
    to: string,
    body: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
    if (!client) {
        console.log(`[WhatsApp Mock] To: ${to}\n${body}`);
        return { success: true, sid: "mock-sid-" + Date.now() };
    }

    try {
        const message = await client.messages.create({
            from: FROM_NUMBER,
            to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
            body,
        });
        return { success: true, sid: message.sid };
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("[WhatsApp Error]", errMsg);
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
