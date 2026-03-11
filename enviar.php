<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Importa as classes do PHPMailer para o namespace global
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Carrega o autoloader do Composer (essencial no Render)
require 'vendor/autoload.php';

// Verifica se o formulário foi enviado via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $mail = new PHPMailer(true);

    try {
        // --- Configurações do Servidor ---
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;      // Descomente para ver erros detalhados
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';           // Servidor SMTP do Gmail
        $mail->SMTPAuth   = true;
        
        // Puxa as credenciais das Variáveis de Ambiente do Render
        $mail->Username   = getenv('EMAIL_USER');       // Seu e-mail (ex: seu@gmail.com)
        $mail->Password   = getenv('EMAIL_PASS');       // Aquela senha de 16 dígitos
        
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
        $mail->Port       = 587;

        // --- Remetente e Destinatário ---
        // Quem envia (seu e-mail autenticado)
        $mail->setFrom(getenv('EMAIL_USER'), 'Contato Portfolio');
        
        // Quem recebe (você mesmo)
        $mail->addAddress(getenv('EMAIL_USER'));
        
        // E-mail de resposta (será o e-mail que o usuário digitou no form)
        if (isset($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($_POST['email'], $_POST['nome']);
        }

        // --- Conteúdo da Mensagem ---
        $mail->isHTML(true);
        $mail->Subject = 'Novo contato: ' . ($_POST['nome'] ?? 'Sem nome');
        
        // Montando o corpo do e-mail com HTML básico
        $corpoHTML = "<h2>Nova mensagem do seu Portfólio</h2>";
        $corpoHTML .= "<p><b>Nome:</b> " . htmlspecialchars($_POST['nome']) . "</p>";
        $corpoHTML .= "<p><b>E-mail:</b> " . htmlspecialchars($_POST['email']) . "</p>";
        $corpoHTML .= "<p><b>Mensagem:</b><br>" . nl2br(htmlspecialchars($_POST['mensagem'])) . "</p>";
        
        $mail->Body = $corpoHTML;

        // Envia o e-mail
        $mail->send();
        
        // Redireciona ou exibe mensagem de sucesso
        echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href='/';</script>";
        
    } catch (Exception $e) {
        echo "A mensagem não pôde ser enviada. Erro do Mailer: {$mail->ErrorInfo}";
    }
} else {
    // Se tentarem acessar o arquivo diretamente sem o POST
    header("Location: /");
    exit();
}