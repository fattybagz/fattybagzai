# fattybagz.ai

Modern, AI-focused landing page and portfolio built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

## 📦 Features

- ✨ Modern, sleek landing page with hero section
- 📝 Lead capture form with validation
- 💼 Portfolio showcase page
- 📱 Fully responsive design
- 🎨 Beautiful animations and transitions
- 🎯 SEO optimized
- ⚡ Performance optimized

## 🛠️ Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure your email service:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your credentials.

## 📧 Email Integration

The contact form is ready to integrate with email services. Configure one of these options in `app/api/contact/route.ts`:

### Option 1: Resend (Recommended)

```bash
npm install resend
```

Configure in `.env.local`:

```
RESEND_API_KEY=your_api_key
CONTACT_EMAIL=your-email@example.com
```

### Option 2: SendGrid, Nodemailer, or Database Storage

See the API route for integration examples.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

Your site will be live with custom domain `fattybagz.ai`.

## 📁 Project Structure

```
fattybagzai/
├── app/
│   ├── api/contact/route.ts      # Contact form API
│   ├── components/               # Reusable components
│   ├── portfolio/page.tsx        # Portfolio page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── public/                       # Static assets
└── .env.local.example            # Environment template
```

---

Built with ❤️ for fattybagz.ai
