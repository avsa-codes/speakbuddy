import { HowItWorksStep } from './HowItWorksStep';

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-5 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-14 lg:pb-32 lg:pt-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            How It Works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Get started in 3 simple steps.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Pick what you want to practice, meet someone at your level, and
            start speaking.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <HowItWorksStep
            number="01"
            title="Pick a Topic"
            description="Choose from Placement GD Prep, Interview Practice, or Casual English."
          />

          <HowItWorksStep
            number="02"
            title="Match & Speak Live"
            description="Connect in under 10 seconds over audio/video with peers at your fluency level."
          />

          <HowItWorksStep
            number="03"
            title="Track Your Soft-Skill Score"
            description="Receive real peer feedback after every talk to build a verified score for your resume/LinkedIn."
          />
        </div>
      </div>
    </section>
  );
}
