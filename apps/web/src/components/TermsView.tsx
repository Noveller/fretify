export function TermsView() {
  return (
    <div className="w-full max-w-2xl flex flex-col gap-6 py-4 text-sm leading-relaxed"
      style={{ color: 'var(--color-on-surface-muted)' }}>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--color-on-surface-muted)' }}>Last updated: May 2026</p>

      {[
        {
          title: '1. Acceptance of Terms',
          body: 'By accessing or using Fretify ("the Service") at fretify.online, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.',
        },
        {
          title: '2. Description of Service',
          body: 'Fretify is a web-based guitar learning tool providing chord diagrams, scale visualizations, a metronome, a drum machine, and ear-training lessons. Some features require a paid subscription.',
        },
        {
          title: '3. Accounts',
          body: 'You must provide a valid email address to create an account. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to use the Service.',
        },
        {
          title: '4. Subscriptions and Payments',
          body: 'Premium features are available through a monthly subscription at $3.99/month. Payments are processed by Paddle (paddle.com). A 7-day free trial is available for new subscribers. You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.',
        },
        {
          title: '5. Refunds',
          body: 'Refunds are handled according to our Refund Policy, available at fretify.online/refund.',
        },
        {
          title: '6. Intellectual Property',
          body: 'All content, code, and materials on Fretify are owned by Alex (the creator of Fretify) unless otherwise noted. You may not reproduce, distribute, or create derivative works without explicit permission.',
        },
        {
          title: '7. Limitation of Liability',
          body: 'Fretify is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.',
        },
        {
          title: '8. Changes to Terms',
          body: 'We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.',
        },
        {
          title: '9. Contact',
          body: 'For questions about these Terms, contact us at: chakopss@gmail.com',
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
