import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const EXTRACT_API = "https://santaai-production-fba8.up.railway.app/extract";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.name.endsWith(".pdf")) {
        return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    // Use santaai extraction API
    const extractForm = new FormData();
    extractForm.append("file", file);
    extractForm.append("file_type", "pdf");

    const extractRes = await fetch(EXTRACT_API, { method: "POST", body: extractForm });
    if (!extractRes.ok) {
        return NextResponse.json({ error: "Failed to extract PDF text" }, { status: 500 });
    }
    const extracted = await extractRes.json() as { success: boolean; text: string };
    if (!extracted.success) {
        return NextResponse.json({ error: "PDF extraction failed" }, { status: 500 });
    }
    const resumeText = extracted.text.trim();

    await db.user.update({
        where: { id: session.user.id },
        data: {
            resumeText,
            resumeFileName: file.name,
            resumeUpdatedAt: new Date(),
        },
    });

    return NextResponse.json({
        success: true,
        fileName: file.name,
        textLength: resumeText.length,
    });
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { resumeFileName: true, resumeUpdatedAt: true, resumeText: true },
    });

    return NextResponse.json({
        resumeFileName: user?.resumeFileName ?? null,
        resumeUpdatedAt: user?.resumeUpdatedAt ?? null,
        hasResume: !!user?.resumeText,
    });
}
