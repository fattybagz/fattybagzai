import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email service
    // Examples:
    // - Resend: https://resend.com/docs/send-with-nextjs
    // - SendGrid: https://github.com/sendgrid/sendgrid-nodejs
    // - Nodemailer: https://nodemailer.com/
    // - Or save to a database (Supabase, Firebase, MongoDB, etc.)

    console.log('New contact form submission:', {
      name,
      email,
      company,
      message,
      timestamp: new Date().toISOString(),
    });

    // For now, just log it and return success
    // Replace this with actual email sending or database storage
    
    /* Example with Resend:
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || 'your-email@example.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    */

    return NextResponse.json(
      { message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
