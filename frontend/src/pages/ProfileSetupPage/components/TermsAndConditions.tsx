type TermsAndConditionsProps = {
  onClose: () => void;
};

export default function TermsAndConditions({
  onClose,
}: TermsAndConditionsProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 id="terms-title" className="text-xl font-semibold">
            Terms & Conditions
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close terms and conditions"
            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 text-sm leading-6 text-slate-300 sm:px-6">
          <p className="mb-5">
            Welcome to SpeakBuddy. By creating and using your account, you agree
            to follow these terms to help keep the platform safe and respectful
            for everyone.
          </p>

          <h3 className="mb-2 font-semibold text-white">1. Using SpeakBuddy</h3>
          <p className="mb-5">
            SpeakBuddy helps users practise spoken English and communicate with
            other users. You agree to use the platform lawfully and
            respectfully, and not to disrupt or misuse its services.
          </p>

          <h3 className="mb-2 font-semibold text-white">
            2. Respectful Conduct
          </h3>
          <p className="mb-5">
            Do not harass, threaten, bully, discriminate against, or abuse other
            users. Unwanted sexual remarks, inappropriate behaviour, and
            repeated disruption of conversations are not permitted.
          </p>

          <h3 className="mb-2 font-semibold text-white">
            3. Privacy and Personal Information
          </h3>
          <p className="mb-5">
            Respect other users' privacy. Do not pressure anyone to share
            personal contact details or sensitive information. Avoid sharing
            information you do not want other users to see.
          </p>

          <h3 className="mb-2 font-semibold text-white">
            4. Your Content and Profile
          </h3>
          <p className="mb-5">
            You are responsible for the information, profile details, messages,
            and other content you share. Do not post unlawful, misleading,
            abusive, or infringing content.
          </p>

          <h3 className="mb-2 font-semibold text-white">
            5. Reporting and Account Restrictions
          </h3>
          <p className="mb-5">
            SpeakBuddy may review reported behaviour and restrict or suspend
            accounts that violate these terms, subject to applicable law.
            Serious or repeated violations may result in permanent suspension.
          </p>

          <h3 className="mb-2 font-semibold text-white">
            6. Service Availability
          </h3>
          <p className="mb-5">
            Features may change, be interrupted, or become unavailable. We will
            make reasonable efforts to maintain the service, but uninterrupted
            availability is not guaranteed.
          </p>

          <h3 className="mb-2 font-semibold text-white">
            7. Changes and Contact
          </h3>
          <p className="mb-5">
            These terms may be updated as SpeakBuddy evolves. Continued use
            after updated terms are presented may be subject to those updates.
            Contact the SpeakBuddy team through the contact details provided on
            the platform if you have questions.
          </p>

          <p className="border-t border-white/10 pt-4 text-xs text-slate-500">
            Please read these terms carefully before agreeing.
          </p>
        </div>

        <div className="border-t border-white/10 px-5 py-4 text-right sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
