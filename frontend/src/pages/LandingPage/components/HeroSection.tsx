// import heroStudent from '../../../assets/images/hero-student.png';

// export function HeroSection({
//   connectionCount,
// }: {
//   connectionCount: number | null;
// }) {
//   return (
//     <section className="relative overflow-hidden border-b border-white/10">
//       <div className="mx-auto grid max-w-7xl items-center lg:min-h-[480px] lg:grid-cols-2">
//         {/* Hero content */}
//         <div className="relative z-10 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:py-16">
//           {/* Header Row: Live Counter + Category Tags */}
//           <div className="mb-6 flex flex-wrap items-center gap-3">
//             {connectionCount !== null && (
//               <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
//                 <span className="relative flex h-2 w-2">
//                   <span className="absolute -inset-0.5 animate-pulse rounded-full bg-emerald-500/50 blur-xs" />
//                   <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
//                 </span>
//                 <span className="font-mono font-semibold">
//                   {connectionCount}
//                 </span>
//                 <span className="text-[10px] tracking-wider uppercase">
//                   Live
//                 </span>
//               </div>
//             )}

//             <p className="text-xs font-medium tracking-wide text-slate-400 sm:text-sm">
//               Placement Prep <span className="mx-1 text-blue-400">·</span>
//               Interview Practice <span className="mx-1 text-blue-400">·</span>
//               English Fluency
//             </p>
//           </div>

//           <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
//             Speak Fluent English
//             <br />
//             <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
//               Without the Fear of Being Judged.
//             </span>
//           </h1>

//           <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
//             Practise real conversations, build confidence, and improve your
//             spoken English — together.
//           </p>

//           <a
//             href="/login"
//             className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#070B1A]"
//           >
//             Start Practising — Free
//             <span aria-hidden="true">→</span>
//           </a>
//         </div>

//         {/* Hero photograph */}
//         <div className="relative h-[320px] sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
//           <img
//             src={heroStudent}
//             alt="A student practising English with headphones and a laptop"
//             className="h-full w-full object-cover object-center"
//           />
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B1A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#070B1A] lg:via-[#070B1A]/10 lg:to-transparent" />
//         </div>
//       </div>
//     </section>
//   );
// }



//REGISTRATION FORM 




import { useState } from 'react';

export function HeroSection({
  connectionCount,
}: {
  connectionCount: number | null;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [day, setDay] = useState<'Saturday' | 'Sunday'>('Saturday');
  const [timeSlot, setTimeSlot] = useState('10 AM – 12 PM');

  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const timeSlots = [
    '10 AM – 12 PM',
    '12 PM – 2 PM',
    '2 PM – 4 PM',
    '4 PM – 6 PM',
  ];



const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setSubmitStatus('idle');

  const formData = new URLSearchParams({
    name: name.trim(),
    phone: phone.trim(),
    day,
    timeSlot,
  });

  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbydJkZG9TJI2dXnIVVONTXV0hltB2pA735TX5KkdG23S_HTiIjKsuqtCTUGj12oligY/exec',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Registration failed.');
    }

    setSubmitStatus('success');
  } catch (error) {
    console.error('Registration error:', error);
    setSubmitStatus('error');
  }
};



  return (
    <section className="relative border-b border-white/10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:min-h-[480px] lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-16">
        {/* Left: Offer information */}
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {connectionCount !== null && (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute -inset-0.5 animate-pulse rounded-full bg-emerald-500/50 blur-xs" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono font-semibold">
                  {connectionCount}
                </span>
                <span className="text-[10px] uppercase tracking-wider">
                  Live
                </span>
              </div>
            )}

            <p className="text-xs font-medium tracking-wide text-slate-400 sm:text-sm">
              PLACEMENT PREP <span className="mx-1 text-blue-400">·</span>
              INTERVIEW PRACTICE <span className="mx-1 text-blue-400">·</span>
              ENGLISH FLUENCY
            </p>
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl">
            Practice English with
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              confidence, not fear.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Join a free 10-minute conversation on the weekend. Practise speaking
            English, share your thoughts, and get comfortable talking with
            another person in a friendly, judgment-free environment.
          </p>

          <div className="mt-7 space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                ✓
              </span>
              <div>
                <p className="font-medium text-white">
                  Real conversation practice
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Speak instead of just studying grammar or watching videos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                ✓
              </span>
              <div>
                <p className="font-medium text-white">
                  Choose your weekend preference
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Tell us whether Saturday or Sunday works better and choose a
                  preferred time window.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Weekend registration form */}
        <div className="w-full">
          <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-900 to-[#0B1022] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Free weekend sessions
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Reserve your preference
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Share your details so we can coordinate your 10-minute practice
                conversation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="weekend-name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Your name
                </label>
                <input
                  id="weekend-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-600 bg-[#080D1D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="weekend-phone"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Phone number
                </label>
                <input
                  id="weekend-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  maxLength={20}
                  pattern="[+]?[0-9 ()-]{8,20}"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full rounded-xl border border-slate-600 bg-[#080D1D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-slate-200">
                  Preferred day
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {(['Saturday', 'Sunday'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={day === option}
                      onClick={() => setDay(option)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        day === option
                          ? 'border-blue-500 bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30'
                          : 'border-slate-600 bg-[#080D1D] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="weekend-slot"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Preferred time window
                </label>
                <select
                  id="weekend-slot"
                  name="timeSlot"
                  required
                  value={timeSlot}
                  onChange={(event) => setTimeSlot(event.target.value)}
                  className="w-full rounded-xl border border-slate-600 bg-[#080D1D] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  These are preferred time windows, not the length of your call.
                </p>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0B1022] sm:text-base"
              >
                Submit Weekend Preference
                <span aria-hidden="true">→</span>
              </button>

              {submitStatus === 'success' && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
                >
                  <p className="font-semibold text-emerald-400">
                    Registration submitted successfully!
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Your weekend preference has been saved. Create your
                    SpeakBuddy account next to continue.
                  </p>
                  <a
                    href="/register"
                    className="mt-3 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Create your account →
                  </a>
                </div>
              )}

              {submitStatus === 'error' && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  We couldn’t confirm your registration. Please try again.
                </p>
              )}

              <p className="text-center text-xs leading-5 text-slate-400">
                Free 10-minute conversation · Account creation required.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
