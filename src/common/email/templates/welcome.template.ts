export function welcomeTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Bem-vindo!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
          color: #333;
        }
        h2 {
          color: #63038C;
        }
      </style>
    </head>
    <body>
      <h2>Olá ${name},</h2>
      <p>Seja muito bem-vindo à nossa plataforma! Estamos felizes em ter você conosco.</p>
      <p>Se tiver dúvidas, estamos à disposição.</p>
      <p>Abraços,<br />Equipe de Suporte</p>
    </body>
    </html>
  `;
}
