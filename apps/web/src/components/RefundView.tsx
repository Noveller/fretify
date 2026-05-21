export function RefundView() {
  return (
    <div className="w-full max-w-2xl flex flex-col gap-6 py-4 text-sm leading-relaxed"
      style={{ color: 'var(--color-on-surface-muted)' }}>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
        Refund Policy
      </h1>
      <p>Last updated: May 2026</p>

      {[
        {
          title: 'Free Trial',
          body: 'New subscribers receive a 7-day free trial. You will not be charged during the trial period. You may cancel at any time before the trial ends to avoid any charges.',
        },
        {
          title: 'Cancellation',
          body: 'You may cancel your Fretify Premium subscription at any time. After cancellation, you will retain access to premium features until the end of your current billing period. No further charges will be made.',
        },
        {
          title: 'Refund Eligibility',
          body: 'If you are charged and believe it was in error, contact us within 14 days of the charge at chakopss@gmail.com with your account email and a description of the issue. We review all refund requests on a case-by-case basis and aim to respond within 3 business days.',
        },
        {
          title: 'How to Request a Refund',
          body: 'Email chakopss@gmail.com with subject line "Refund Request" and include your account email address and the date of the charge. Approved refunds are processed within 5–10 business days via Paddle (our payment processor).',
        },
        {
          title: 'Contact',
          body: 'For any questions about billing or refunds, contact: chakopss@gmail.com',
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
