require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração do Transportador usando variáveis de ambiente
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para porta 465, false para outras
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Rota para receber os dados do formulário
app.post('/enviar-email', (req, res) => {
    const { name, email, message } = req.body;

    // Validação básica
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // O Gmail sempre usará seu e-mail como remetente real
        to: 'kaykyrodriguesdepaula@gmail.com',
        replyTo: email, // Permite que você responda direto para o e-mail de quem preencheu
        subject: `Novo Contato do Portfólio: ${name}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2>Nova mensagem de contato</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <hr>
                <p><strong>Mensagem:</strong></p>
                <p>${message}</p>
            </div>
        `
    };

    transport.sendMail(mailOptions)
        .then(() => {
            console.log('E-mail enviado com sucesso!');
            res.status(200).json({ message: 'E-mail enviado com sucesso!' });
        })
        .catch((err) => {
            console.error('Erro ao enviar e-mail:', err);
            res.status(500).json({ error: 'Falha ao enviar o e-mail.', details: err.message });
        });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});