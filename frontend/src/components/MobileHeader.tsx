import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

type MobileHeaderProps = {
  to?: string;
};

function MobileHeader({ to = '/home' }: MobileHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#070B1A] px-5 py-4 lg:hidden">
      <Link
        to={to}
        className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
          <MessageCircle size={18} strokeWidth={2.2} />
        </div>
        SpeakBuddy
      </Link>
    </header>
  );
}

export default MobileHeader;
