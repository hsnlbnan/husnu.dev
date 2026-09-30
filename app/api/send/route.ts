import { EmailTemplate } from "../../../components/EmailTemplate";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Modül seviyesinde `new Resend(...)` çağrısı, API key tanımlı değilken
// `next build` sırasında sayfa verisi toplanırken build'i patlatıyordu.
// İstek anında oluşturmak build'i secret'lardan bağımsız kılar.
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY ?? process.env.NEXT_PUBLIC_RESEND_API;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  const resend = getResendClient();
  if (!resend) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "bilgi@husnu.dev",
      to: ["hsnlbnan@gmail.com"],
      subject: "Husnu.dev'den yeni bir mesajınız var!",
      react: EmailTemplate({
        name,
        email,
        message,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
