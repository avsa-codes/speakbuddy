import heroStudent from '../../../assets/images/hero-student.png';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto grid max-w-7xl items-center lg:min-h-[480px] lg:grid-cols-2">
        {/* Hero content */}
        <div className="relative z-10 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:py-16">
          <p className="mb-6 text-xs font-medium tracking-wide text-slate-400 sm:text-sm">
            Placement Prep <span className="mx-2 text-blue-400">·</span>
            Interview Practice <span className="mx-2 text-blue-400">·</span>
            English Fluency
          </p>

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Speak Fluent English
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Without the Fear of Being Judged.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
            Practise real conversations, build confidence, and improve your
            spoken English — together.
          </p>

          <a
            href="/login"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#070B1A]"
          >
            Start Practising — Free
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Existing hero photograph */}
        <div className="relative h-[320px] sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
          <img
            src={heroStudent}
            alt="A student practising English with headphones and a laptop"
            className="h-full w-full object-cover object-center"
          />

          {/* Subtle blend into the existing dark background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B1A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#070B1A] lg:via-[#070B1A]/10 lg:to-transparent" />
        </div>
      </div>
    </section>
  );
}
