import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            telegramLinked: true,
            telegramChatId: true,
            preferredRole: true,
            skills: true,
            experienceLevel: true,
            preferredLocation: true,
            salaryMin: true,
            salaryMax: true,
            jobTypes: true,
            briefingTime: true,
            timezone: true,
            briefingEnabled: true,
            trendAlerts: true,
            reminderBefore: true,
            onboarded: true,
            resumeFileName: true,
            resumeUpdatedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Only allow safe profile fields — never update id, email, resumeText etc. via this route
    const {
        name, phone, telegramChatId, telegramLinked,
        preferredRole, skills, experienceLevel, preferredLocation,
        salaryMin, salaryMax, jobTypes,
        briefingTime, timezone, briefingEnabled, trendAlerts, reminderBefore,
        onboarded,
    } = body;

    const updated = await db.user.update({
        where: { id: session.user.id },
        data: {
            ...(name !== undefined && { name }),
            ...(phone !== undefined && { phone }),
            ...(telegramChatId !== undefined && { telegramChatId }),
            ...(telegramLinked !== undefined && { telegramLinked }),
            ...(preferredRole !== undefined && { preferredRole }),
            ...(skills !== undefined && { skills }),
            ...(experienceLevel !== undefined && { experienceLevel }),
            ...(preferredLocation !== undefined && { preferredLocation }),
            ...(salaryMin !== undefined && { salaryMin }),
            ...(salaryMax !== undefined && { salaryMax }),
            ...(jobTypes !== undefined && { jobTypes }),
            ...(briefingTime !== undefined && { briefingTime }),
            ...(timezone !== undefined && { timezone }),
            ...(briefingEnabled !== undefined && { briefingEnabled }),
            ...(trendAlerts !== undefined && { trendAlerts }),
            ...(reminderBefore !== undefined && { reminderBefore }),
            ...(onboarded !== undefined && { onboarded }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            resumeFileName: true,
            resumeUpdatedAt: true,
            updatedAt: true,
        },
    });

    return NextResponse.json({ user: updated });
}
