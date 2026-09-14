import { LiveDiscussionCard } from './LiveDiscussionCard';
import heroStudent from '../../../assets/images/hero-student.png';

export function HeroSection() {
  return (
    <section className="relative overflow-x-clip px-5 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-2 lg:pb-24 lg:pt-4">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Left side */}
        <div>
          <div className="mb-5 inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
            <span aria-hidden="true">⚡</span>
            <span className="ml-2">
              Placement Prep, Interview Practice & Daily English Fluency
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            Speak Fluent English{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Without the Fear of Being Judged.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Match in 10 seconds with students across India for live 1-on-1
            English practice and Group Discussions (GDs). Free, unscripted, and
            100% judgment-free.
          </p>

          <div className="mt-8">
            <a
              href="/login"
              className="inline-flex items-center rounded-xl bg-blue-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-blue-500/40"
            >
              Start Practicing Now (Free)
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300">
            <span>✓ 100% Free</span>
            <span>✓ Instant Matches</span>
            <span>✓ Campus Placement Topics</span>
          </div>
        </div>

        {/* Right side */}
        <div className="relative mx-auto w-full max-w-xl">
          {/* Student image */}
          <div className="overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src={heroStudent}
              alt="Student practicing English through a video conversation"
              className="h-[400px] w-full object-cover sm:h-[460px]"
            />
          </div>

          {/* 
            Desktop:
            The card floats over the image.

            Mobile:
            The card stays in normal document flow underneath the image.
          */}
          <div className="relative mx-auto mt-5 w-full max-w-[340px] lg:absolute lg:bottom-6 lg:right-0 lg:mt-0">
            <LiveDiscussionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
