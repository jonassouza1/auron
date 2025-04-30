import nodemailer from "nodemailer";

interface User {
  name: string;
  email: string;
  phone: { number: string };
}

interface Address {
  zip_code: string;
  street_name: string;
  street_number: string;
  city_name: string;
  state_name: string;
  country_name: string;
}

interface Product {
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface EmailData {
  user: User;
  address: Address;
  productPurchased: Product[];
}

let emailData: { status: string | null; data: EmailData | null } = {
  status: null,
  data: null,
};

export async function serverEmailNotification(
  status: string | null,
  data: EmailData | null,
) {
  if (status) emailData.status = status;
  if (data) emailData.data = data;

  if (emailData.status && emailData.data) {
    await sendEmail(emailData.status, emailData.data);
    emailData = { status: null, data: null };
  }
}

async function sendEmail(status: string, data: EmailData) {
  console.log("Enviando email...");

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <h1>Notificação de Status de Pagamento</h1>
    <p><strong>Status:</strong> ${status}</p>
    <h2>Dados do Usuário</h2>
    <p><strong>Nome:</strong> ${data.user.name}</p>
    <p><strong>Telefone:</strong> ${data.user.phone.number}</p>
    <p><strong>Email:</strong> ${data.user.email}</p>
    <h2>Endereço de Entrega</h2>
    <p><strong>CEP:</strong> ${data.address.zip_code}</p>
    <p><strong>Rua:</strong> ${data.address.street_name}</p>
    <p><strong>Número:</strong> ${data.address.street_number}</p>
    <p><strong>Cidade:</strong> ${data.address.city_name}</p>
    <p><strong>Estado:</strong> ${data.address.state_name}</p>
    <p><strong>País:</strong> ${data.address.country_name}</p>
    <h2>Produto Comprado</h2>
    ${data.productPurchased
      .map(
        (product) => `
        <div>
          <p><strong>Título:</strong> ${product.title}</p>
          <p><strong>Descrição:</strong> ${product.description}</p>
          <p><strong>Quantidade:</strong> ${product.quantity}</p>
          <p><strong>Preço Unitário:</strong> R$ ${product.unit_price.toFixed(2)}</p>
        </div>
      `,
      )
      .join("")}
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Notificação de Status de Pagamento",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
  console.log("E-mail enviado com sucesso");
}
