import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  message,
}) => (
  <div>
    <h1>Selam Hüsnü!</h1>
    <p>{name} adlı kişiden bir mesajınız var:</p>
    <p>{message}</p>
    <p>İletişim için: {email}</p>
  </div>
);
