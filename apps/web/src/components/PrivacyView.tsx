export function PrivacyView() {
  return (
    <div className="w-full max-w-2xl flex flex-col gap-6 py-4 text-sm leading-relaxed"
      style={{ color: 'var(--color-on-surface-muted)' }}>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
        Privacy Policy
      </h1>
      <p>Last updated: May 2026</p>

      {[
        {
          title: '1. Information We Collect',
          body: 'We collect your email address when you create an account. We store your subscription status. We do not collect payment card details — all payments are processed by Paddle (paddle.com) under their own privacy policy.',
        },
        {
          title: '2. How We Use Your Information',
          body: 'We use your email to authenticate your account and send transactional emails (e.g. email confirmation). We use your subscription status to grant access to premium features. We do not sell or share your personal data with third parties for marketing purposes.',
        },
        {
          title: '3. Data Storage',
          body: 'Your account data is stored securely using Supabase (supabase.com), hosted on AWS infrastructure in the EU (eu-central-1 region). Data is encrypted at rest and in transit.',
        },
        {
          title: '4. Cookies',
          body: 'We use authentication session tokens stored in your browser to keep you logged in. We do not use third-party tracking or advertising cookies.',
        },
        {
          title: '5. Third-Party Services',
          body: 'We use Supabase for authentication and database storage, and Paddle for payment processing. Each service has its own privacy policy governing their data handling.',
        },
        {
          title: '6. Your Rights',
          body: 'You may request deletion of your account and personal data at any time by emailing chakopss@gmail.com. We will process your request within 30 days.',
        },
        {
          title: '7. Children\'s Privacy',
          body: 'Fretify is not directed at children under 13. We do not knowingly collect personal information from children under 13.',
        },
        {
          title: '8. Changes to This Policy',
          body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page.',
        },
        {
          title: '9. Contact',
          body: 'For privacy-related questions, contact: chakopss@gmail.com',
        },
      ].map(({ title, body }) => (
        <section key={title}>
          <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
    </div>
  );
}
