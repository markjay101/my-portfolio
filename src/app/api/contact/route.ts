import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    subject?: string;
    message?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const subject = body?.subject?.trim() ?? "";
  const message = body?.message?.trim() ?? "";

  // Validation
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 },
    );
  }
  if (!subject) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Environment variables
  const gmailUser = process.env.EMAIL_USER;
  const gmailPass = process.env.EMAIL_PASS;
  const contactTo = process.env.EMAIL_TO;

  if (!gmailUser || !gmailPass || !contactTo) {
    return NextResponse.json(
      { error: "Server email is not configured" },
      { status: 500 },
    );
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass, // must be an App Password if 2FA is enabled
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: gmailUser,
      to: contactTo,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${email}\n\n${message}`,
    });

    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
