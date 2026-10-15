import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone
    ) {
      return;
    }

    if (localStorage.getItem('speakbuddy-install-dismissed') === 'true') {
      return;
    }

    const timer = window.setTimeout(() => setShowPopup(true), 2500);

    const handleInstallAvailable = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setShowPopup(true);
    };

    const handleInstalled = () => {
      setShowPopup(false);
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleInstallAvailable);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleInstallAvailable);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    localStorage.setItem('speakbuddy-install-dismissed', 'true');
  };

  const installApp = async () => {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;

      if (choice.outcome === 'accepted') {
        setShowPopup(false);
      }

      setInstallEvent(null);
      return;
    }

    setShowInstructions(true);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 z-[100] mx-auto max-w-sm">
      <div className="rounded-2xl border border-white/10 bg-[#10172B] p-4 shadow-2xl shadow-black/40">
        <div className="flex items-start gap-3">
          <img
            src="/pwa-192x192.png"
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl"
          />

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">Install SpeakBuddy</p>
            <p className="mt-1 text-sm text-slate-400">
              Get quick access from your home screen.
            </p>
          </div>

          <button
            type="button"
            onClick={dismissPopup}
            aria-label="Dismiss install prompt"
            className="rounded-lg px-2 py-1 text-xl leading-none text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        {showInstructions ? (
          <div className="mt-4 rounded-xl bg-white/5 p-3 text-sm text-slate-300">
            <p className="font-medium text-white">
              Add SpeakBuddy to your home screen
            </p>
            <p className="mt-2">
              On iPhone: tap Share in Safari, then choose Add to Home Screen.
            </p>
            <p className="mt-2">
              On Android: open your browser menu and choose Install app or Add
              to Home screen.
            </p>
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="mt-3 text-sm font-medium text-blue-300"
            >
              Back
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={installApp}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Install app
          </button>
        )}
      </div>
    </div>
  );
}
