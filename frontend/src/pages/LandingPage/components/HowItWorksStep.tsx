interface HowItWorksStepProps {
  number: string;
  title: string;
  description: string;
}

export function HowItWorksStep({
  number,
  title,
  description,
}: HowItWorksStepProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.05]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}
