import {
  ArrowRight,
  BriefcaseBusiness,
  Coffee,
  FileText,
  Mic,
  Video,
  Users,
} from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start a conversation in{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              3 simple steps.
            </span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Step 1 */}
          <article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                1
              </span>
              <h3 className="text-lg font-semibold text-white">
                Choose a Topic
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Pick what you want to practise.
            </p>

            <div className="mt-7 space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-blue-400/50 bg-blue-500/10 p-3">
                <BriefcaseBusiness size={20} className="text-blue-400" />
                <span className="text-sm text-white">Placement Prep</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <FileText size={20} className="text-slate-400" />
                <span className="text-sm text-slate-300">
                  Interview Practice
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <Coffee size={20} className="text-slate-400" />
                <span className="text-sm text-slate-300">Casual English</span>
              </div>
            </div>
          </article>

          {/* Step 2 */}
          <article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                2
              </span>
              <h3 className="text-lg font-semibold text-white">Get Matched</h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Meet another learner.
            </p>

            <div className="flex min-h-[200px] items-center justify-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-400/70 bg-blue-500/10">
                <Users size={34} className="text-blue-300" />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="h-2 w-2 rounded-full bg-blue-400" />
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-violet-400/70 bg-violet-500/10">
                <Users size={34} className="text-violet-300" />
              </div>
            </div>
          </article>

          {/* Step 3 */}
          <article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                3
              </span>
              <h3 className="text-lg font-semibold text-white">
                Start Speaking
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Practise real conversations.
            </p>

            <div className="mt-7 flex min-h-[180px] items-center justify-center gap-5 rounded-2xl border border-white/10 bg-[#0B1020] px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200">
                <Mic size={23} />
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200">
                <Video size={23} />
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white">
                <ArrowRight size={23} className="rotate-45" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
