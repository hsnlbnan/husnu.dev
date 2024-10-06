import { EmailTemplate } from "../../../components/EmailTemplate";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
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
