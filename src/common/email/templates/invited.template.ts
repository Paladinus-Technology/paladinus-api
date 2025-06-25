export function invitedEmail(token: string): string {
  const link = `https://suaapp.com/complete-signup?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <h2 style="color: #333;">🎉 Você foi convidado para a plataforma Paladinus</h2>
      <p style="color: #555;">Olá ! Um administrador da sua empresa criou um acesso para você na plataforma <strong>Paladinus</strong>.</p>
      <p style="color: #555;">Para concluir seu cadastro e definir uma senha, clique no botão abaixo:</p>
  
      <a href="${link}" target="_blank" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Concluir Cadastro
      </a>
  
      <p style="color: #888; font-size: 14px;">Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
      <p style="word-break: break-all; color: #666;">
        <a href="${link}" target="_blank" style="color: #007bff;">${link}</a>
      </p>
  
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #aaa;">Este link é válido por 24 horas. Caso você não esteja esperando este convite, pode ignorar este e-mail.</p>
    </div>
    `;
}
