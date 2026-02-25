import { NextRequest, NextResponse } from "next/server";
import { chat, type ChatMessage, type UserContext } from "@/lib/claude";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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

    // Inject user profile + resume if session exists
    let userContext: UserContext | undefined;
    const session = await auth();
    if (session?.user?.id) {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
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
    }

    const response = await chat(messages, userContext);

    return NextResponse.json({
        reply: response,
        timestamp: new Date().toISOString(),
    });
}
