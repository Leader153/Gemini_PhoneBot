const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Сервис отправки уведомлений по электронной почте.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Отправляет информацию о заказе на email оператора.
 * @param {Object} orderDetails - Данные заказа
 * @returns {Promise<boolean>} - Успешно ли отправлено
 */
async function sendOrderEmail(orderDetails) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
        console.warn('⚠️ Настройки Email отсутствуют в .env. Отправка отменена.');
        return false;
    }

    const mailOptions = {
        from: `"Gemini Voice Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `Новый заказ яхты от ${orderDetails.clientName} ⛵`,
        text: `
НОВЫЙ ЗАКАЗ ЯХТЫ JOY-BE
-----------------------
Имя клиента: ${orderDetails.clientName}
Телефон: ${orderDetails.clientPhone}
Желаемая дата: ${orderDetails.date} (2026 год)
Желаемое время: ${orderDetails.time || 'Не указано'}
Длительность: ${orderDetails.duration} ч.

Статус: Требуется подтверждение оператора.
        `,
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px; max-width: 600px;">
                <h2 style="color: #2c3e50;">🚢 Новый заказ яхты Joy-BE</h2>
                <hr>
                <p><strong>Имя клиента:</strong> ${orderDetails.clientName}</p>
                <p><strong>Телефон:</strong> <a href="tel:${orderDetails.clientPhone}">${orderDetails.clientPhone}</a></p>
                <p><strong>Дата:</strong> ${orderDetails.date}</p>
                <p><strong>Время:</strong> ${orderDetails.time || 'Не указано'}</p>
                <p><strong>Длительность:</strong> ${orderDetails.duration} ч.</p>
                <br>
                <div style="background-color: #f9f9f9; padding: 10px; border-left: 5px solid #3498db;">
                    <strong>Статус:</strong> Ожидает подтверждения оператора
                </div>
                <p style="font-size: 12px; color: #7f8c8d; margin-top: 20px;">
                    Это автоматическое сообщение от вашего голосового помощника Gemini.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email отправлен успешно:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Ошибка при отправке Email:', error);
        return false;
    }
}

module.exports = { sendOrderEmail };
