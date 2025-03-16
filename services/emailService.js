import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendReportEmail(to, reportPdf, reportData) {
  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject: 'Your Rental Property Analysis Report',
    html: generateEmailTemplate(reportData),
    attachments: [
      {
        filename: 'rental-analysis-report.pdf',
        content: reportPdf,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

function generateEmailTemplate(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Your Rental Analysis Report</h1>
      
      <p>Dear Property Owner,</p>
      
      <p>Thank you for using our rental analysis service. We've completed the analysis for your property at:</p>
      
      <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${data.address}
      </p>
      
      <p>Key findings from your report:</p>
      
      <ul>
        <li>Suggested Rent Range: $${data.rentRange.min} - $${data.rentRange.max}</li>
        <li>Median Market Rent: $${data.medianRent}</li>
        <li>Price per Square Foot: $${data.pricePerSqft}/sqft</li>
      </ul>
      
      <p>Please find your detailed report attached to this email.</p>
      
      <p>If you have any questions about your report, please don't hesitate to contact us.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
        <p>This is an automated email. Please do not reply directly to this message.</p>
      </div>
    </div>
  `;
} 