<?php
// Configuração de Erros para o Render
ini_set('display_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = getenv('EMAIL_USER'); 
        $mail->Password   = getenv('EMAIL_PASS'); 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom(getenv('EMAIL_USER'), 'Portfolio Contato');
        $mail->addAddress(getenv('EMAIL_USER')); 
        
        // Ajustado para os names do seu HTML: name, email, message
        if (!empty($_POST['email'])) {
            $mail->addReplyTo($_POST['email'], $_POST['name'] ?? 'Usuário');
        }

        $mail->isHTML(true);
        $mail->Subject = 'Novo contato: ' . ($_POST['name'] ?? 'Sem nome');
        
        $nome = htmlspecialchars($_POST['name'] ?? 'Não informado');
        $email = htmlspecialchars($_POST['email'] ?? 'Não informado');
        $mensagem = nl2br(htmlspecialchars($_POST['message'] ?? 'Sem mensagem'));

        $mail->Body = "<h3>Nova mensagem do Portfolio</h3>
                       <p><b>Nome:</b> {$nome}</p>
                       <p><b>E-mail:</b> {$email}</p>
                       <p><b>Mensagem:</b><br>{$mensagem}</p>";

        $mail->send();
        
        echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href = '/';</script>";

    } catch (Exception $e) {
        // Se der erro, ele vai imprimir na tela agora
        echo "Erro ao enviar: {$mail->ErrorInfo}";
    }
} else {
    header("Location: /");
}