import { NextResponse } from "next/server";
import { z } from "zod/v4";

const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.email("Email invalide"),
  message: z.string().min(1, "Le message est requis"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const resendKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || "contacts@libellulessenteurs.com";

    if (!resendKey) {
      console.log("[Contact Form] No RESEND_API_KEY set. Message:", data);
      return NextResponse.json({ success: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Libellule Senteurs <onboarding@resend.dev>",
      to: recipientEmail,
      subject: `Nouveau message de ${data.name}`,
      text: `Nom: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }
    console.error("[Contact Form] Error:", error);
    return NextResponse.json(
      { success: false, errors: ["Une erreur est survenue. Réessayez plus tard."] },
      { status: 500 }
    );
  }
}
