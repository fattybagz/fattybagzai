# Deployment Guide for fattybagz.ai

## Quick Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit - fattybagz.ai website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fattybagzai.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `fattybagzai` repository
4. Vercel will auto-detect Next.js - click "Deploy"
5. Wait ~2 minutes for deployment to complete

### Step 3: Add Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add `fattybagz.ai` and `www.fattybagz.ai`
3. Update your domain DNS settings:
   - Add A record pointing to Vercel's IP: `76.76.21.21`
   - Add CNAME for www: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-30 minutes)

### Step 4: Configure Environment Variables (Optional)

If you want email notifications for form submissions:

1. In Vercel project settings, go to "Environment Variables"
2. Add your email service credentials (see below)
3. Redeploy the site

## Email Service Setup (Choose One)

### Option 1: Resend (Easiest - Free tier: 100 emails/day)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Install: `npm install resend`
4. Add to Vercel Environment Variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   CONTACT_EMAIL=your-email@example.com
   ```
5. Uncomment Resend code in `app/api/contact/route.ts`

### Option 2: SendGrid (Free tier: 100 emails/day)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Verify sender email
4. Install: `npm install @sendgrid/mail`
5. Add to Vercel Environment Variables:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=verified-email@example.com
   ```

### Option 3: Database Storage (No email service needed)

Store form submissions in a database instead:

**Supabase (Recommended - Free tier)**

```bash
npm install @supabase/supabase-js
```

Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-key
```

Create table in Supabase:

```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Post-Deployment Checklist

- [ ] Custom domain configured and working
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Contact form tested and working
- [ ] Email notifications configured (optional)
- [ ] Update portfolio projects with real content
- [ ] Add real project images to `/public` folder
- [ ] Update social media links in Footer.tsx
- [ ] Set up Google Analytics or Plausible (optional)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit for performance

## Performance Tips

1. **Optimize Images**: Replace placeholder images with WebP format
2. **Analytics**: Use lightweight analytics like Plausible
3. **Monitoring**: Set up Vercel Analytics (built-in, free)

## DNS Configuration for fattybagz.ai

After deploying to Vercel, configure your domain registrar:

| Type  | Name | Value                |
| ----- | ---- | -------------------- |
| A     | @    | 76.76.21.21          |
| CNAME | www  | cname.vercel-dns.com |

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

Need help? Check the README.md or create an issue on GitHub.
