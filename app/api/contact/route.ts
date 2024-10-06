import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const user = process.env.NEXT_PUBLIC_EMAIL;
const pass = process.env.NEXT_PUBLIC_PASSWORD;

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: "user",
      to: "hsnlbnan@gmail.com",
      subject: "Husnu.dev'den Yeni bir mesaj var!",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Failed to send message.", { status: 500 });
  }
}
