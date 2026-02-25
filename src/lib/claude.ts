import Anthropic from "@anthropic-ai/sdk";

const globalForClaude = globalThis as unknown as {
    claude: Anthropic | undefined;
};

export const claude =
    globalForClaude.claude ??
    new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || "mock-key",
    });

if (process.env.NODE_ENV !== "production") globalForClaude.claude = claude;

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

const SYSTEM_PROMPT = `You are JobPulse, an AI job search assistant on Telegram. You help users:
- Find relevant job postings matching their skills and preferences
- Track their job applications and follow up on them
- Prepare for interviews with company-specific insights
- Understand job market trends and salary benchmarks
- Manage their job search workflow efficiently

Be concise, friendly, and actionable. Format responses for Telegram (use *bold* for emphasis, _italic_ for highlights, bullet points with - for lists).
When the user asks about jobs, reference their profile preferences.
When tracking applications, confirm status changes clearly.
Always be encouraging — job searching is stressful.`;

export async function chat(
    messages: ChatMessage[],
    userContext?: string
): Promise<string> {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "mock-key") {
        return getMockResponse(messages[messages.length - 1]?.content || "");
    }

    const systemPrompt = userContext
        ? `${SYSTEM_PROMPT}\n\n--- User Context ---\n${userContext}`
        : SYSTEM_PROMPT;

    const response = await claude.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
        })),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.text || "I'm sorry, I couldn't process that. Please try again.";
}

function getMockResponse(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes("job") || lower.includes("role") || lower.includes("position")) {
        return "🔍 *Here are some matching jobs for you:*\n\n1. *Senior React Developer* — Flipkart, Bangalore\n   💰 ₹25-35 LPA | 🏠 Hybrid\n\n2. *Full Stack Engineer* — Razorpay, Remote\n   💰 ₹20-30 LPA | 🌐 Remote\n\n3. *Frontend Lead* — CRED, Bangalore\n   💰 ₹30-45 LPA | 🏢 Onsite\n\nWant me to add any of these to your tracker?";
    }
    if (lower.includes("apply") || lower.includes("track") || lower.includes("application")) {
        return "✅ *Got it!* I've added this application to your tracker.\n\n📊 Your active applications:\n- 5 Applied\n- 2 In Review\n- 1 Interview Scheduled\n\nI'll remind you to follow up on any that go quiet for 7+ days.";
    }
    if (lower.includes("interview") || lower.includes("prep")) {
        return "📅 *Interview Prep:*\n\nYour next interview:\n*Senior React Developer @ Flipkart*\n🕐 Tomorrow, 2:00 PM IST\n📹 Video Call\n\n*Quick Prep Notes:*\n- Review React 18 features (Suspense, Server Components)\n- Prepare system design for e-commerce product page\n- Research Flipkart's recent tech blog posts\n\nYou've got this! 💪";
    }
    return "👋 Hey! I'm *JobPulse*, your AI job search assistant.\n\nI can help you with:\n- 🔍 Finding relevant jobs\n- 📊 Tracking applications\n- 📅 Interview reminders & prep\n- 📈 Market trends\n\nWhat would you like to do?";
}
