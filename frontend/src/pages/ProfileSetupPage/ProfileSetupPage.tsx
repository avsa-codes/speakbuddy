import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

function ProfileSetupPage() {
  const { currentUser } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [languageProficiency, setLanguageProficiency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProficiencyOpen, setIsProficiencyOpen] = useState(false);

  const proficiencyOptions = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'ELEMENTARY', label: 'Elementary' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'UPPER_INTERMEDIATE', label: 'Upper Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
    { value: 'PROFICIENT', label: 'Proficient' },
  ];

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          bio,
          interests,
          languageProficiency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

 useEffect(() => {
   if (currentUser) {
     setName(currentUser.name);
     setUsername(currentUser.username);
     setBio(currentUser.bio ?? '');
     setInterests(currentUser.interests ?? []);
     setLanguageProficiency(currentUser.languageProficiency ?? '');
   }
 }, [currentUser]);

  function addInterest() {
    const newInterest = interestInput.trim();

    if (!newInterest) {
      return;
    }

    if (interests.includes(newInterest)) {
      return;
    }

    setInterests([...interests, newInterest]);
    setInterestInput('');
  }

  function removeInterest(interestToRemove: string) {
  setInterests(
    interests.filter((interest) => interest !== interestToRemove)
  );
}

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="px-5 pb-16 pt-10 sm:px-6 sm:pt-14">
        <section className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Complete your profile
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              Tell us a little about yourself so you can start connecting.
            </p>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-8"
          >
            {/* Profile Photo */}

            <div className="flex flex-col items-center border-b border-white/10 pb-8">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/5 text-4xl text-slate-500">
                +
              </div>

              <button
                type="button"
                className="mt-4 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Add Photo
              </button>

              <p className="mt-2 text-xs text-slate-500">
                You can add a profile photo later.
              </p>
            </div>

            <div className="pt-8">
              <h2 className="text-xl font-semibold">Account Information</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-200"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-slate-200"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-200"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={currentUser?.email ?? ''}
                    disabled
                    className="mt-2 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>
                <div className="mt-8 border-t border-white/10 pt-8">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="text-sm font-medium text-slate-200"
                    >
                      Short Bio
                    </label>

                    <span className="text-xs text-slate-500">
                      {bio.length}/150
                    </span>
                  </div>

                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={150}
                    rows={4}
                    placeholder="Tell us a little about yourself..."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                  />
                </div>

                <div className="mt-8 border-t border-white/10 pt-8">
                  <div>
                    <h2 className="text-xl font-semibold">Interests</h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Add a few things you enjoy talking about.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300 transition hover:bg-blue-500/20"
                      >
                        {interest} ×
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      placeholder="Add an interest"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                    />

                    <button
                      type="button"
                      onClick={addInterest}
                      className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8 sm:col-span-2">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Language Proficiency
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Tell us how comfortable you are with the language.
                    </p>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="languageProficiency"
                      className="text-sm font-medium text-slate-200"
                    >
                      Proficiency Level
                    </label>

                    <div className="relative mt-2 w-full min-w-0">
                      <button
                        type="button"
                        onClick={() => setIsProficiencyOpen(!isProficiencyOpen)}
                        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none transition hover:border-white/20 focus:border-blue-400"
                      >
                        <span
                          className={
                            languageProficiency
                              ? 'text-white'
                              : 'text-slate-500'
                          }
                        >
                          {languageProficiency ||
                            'Select your proficiency level'}
                        </span>

                        <span className="text-slate-400">
                          {isProficiencyOpen ? '⌃' : '⌄'}
                        </span>
                      </button>

                      {isProficiencyOpen && (
                        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                          {proficiencyOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setLanguageProficiency(option.value);
                                setIsProficiencyOpen(false);
                              }}
                              className="block w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-8 text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ProfileSetupPage;
