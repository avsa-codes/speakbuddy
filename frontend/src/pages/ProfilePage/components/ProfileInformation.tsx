import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';

function ProfileInformation() {
  const { currentUser, checkAuth } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [languageProficiency, setLanguageProficiency] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
      currentUser?.profilePhoto ?? null
    );
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      console.log('CURRENT USER PHOTO:', currentUser.profilePhoto);
      setName(currentUser.name);
      setUsername(currentUser.username);
      setBio(currentUser.bio ?? '');
      setInterests(currentUser.interests ?? []);
      setLanguageProficiency(currentUser.languageProficiency ?? '');
    }
  }, [currentUser]);

  function handleEdit() {
    setError('');
    setSuccess('');
    setIsEditing(true);
  }

  function handleCancel() {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      setBio(currentUser.bio ?? '');
      setInterests(currentUser.interests ?? []);
      setLanguageProficiency(currentUser.languageProficiency ?? '');
    }

    setInterestInput('');
    setError('');
    setSuccess('');
    setIsEditing(false);
  }

  function addInterest() {
    const newInterest = interestInput.trim();

    if (!newInterest) return;

    if (interests.includes(newInterest)) {
      setInterestInput('');
      return;
    }

    setInterests([...interests, newInterest]);
    setInterestInput('');
  }

  function removeInterest(interestToRemove: string) {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  }

  
  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedPhoto(file);
  };

    const handlePhotoUpload = async () => {
      if (!selectedPhoto) return;

      setIsUploadingPhoto(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append('profilePhoto', selectedPhoto);

        const response = await fetch(
          'http://localhost:5000/api/users/me/photo',
          {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload photo.');
        }

        setSuccess('Profile photo uploaded successfully!');
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while uploading the photo.'
        );
      } finally {
        setIsUploadingPhoto(false);
      }
    };

  async function handleSave() {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

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
        throw new Error(data.message);
      }

      if (selectedPhoto) {
        await handlePhotoUpload();
      }

      setSuccess('Profile updated successfully.');
      await checkAuth();
      setIsEditing(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedPhoto) return;

    const previewUrl = URL.createObjectURL(selectedPhoto);
    setPhotoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedPhoto]);

  useEffect(() => {
    if (currentUser) {
      setPhotoPreview(currentUser.profilePhoto ?? null);
    }
  }, [currentUser]);

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your account and language information.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Edit Profile
          </button>
        ) : null}
      </div>

      {success ? (
        <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </p>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {!isEditing ? (
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Name
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {currentUser?.name || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Username
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              @{currentUser?.username || '—'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Email
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {currentUser?.email || '—'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Bio
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {currentUser?.bio || 'No bio added yet.'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Interests
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {currentUser?.interests?.length ? (
                currentUser.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-indigo-400/15 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No interests added yet.
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Language Proficiency
            </p>

            <p className="mt-2 text-sm font-medium text-white">
              {currentUser?.languageProficiency
                ?.replaceAll('_', ' ')
                .toLowerCase()
                .replace(/\b\w/g, (letter) => letter.toUpperCase()) || '—'}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-7 space-y-6">
          
          <div className="flex flex-col items-center border-b border-white/10 pb-8">
            <div className="h-28 w-28 overflow-hidden rounded-full border border-white/20 bg-white/5">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-slate-500">
                  +
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              Add Photo
            </button>

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG or WebP · Max 5 MB
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:bg-white/[0.07]"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:bg-white/[0.07]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Email
            </label>

            <div className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-slate-500">
              {currentUser?.email || '—'}
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Email cannot be changed here.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:bg-white/[0.07]"
              placeholder="Tell people a little about yourself..."
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Interests
            </label>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(event) => setInterestInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addInterest();
                  }
                }}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:bg-white/[0.07]"
                placeholder="Add an interest"
              />

              <button
                type="button"
                onClick={addInterest}
                className="rounded-xl bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/25"
              >
                Add
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="rounded-full border border-indigo-400/15 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
                >
                  {interest} ×
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Language Proficiency
            </label>

            <select
              value={languageProficiency}
              onChange={(event) => setLanguageProficiency(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.07]"
            >
              <option value="" className="bg-[#070B1A]">
                Select proficiency
              </option>
              <option value="BEGINNER" className="bg-[#070B1A]">
                Beginner
              </option>
              <option value="ELEMENTARY" className="bg-[#070B1A]">
                Elementary
              </option>
              <option value="INTERMEDIATE" className="bg-[#070B1A]">
                Intermediate
              </option>
              <option value="UPPER_INTERMEDIATE" className="bg-[#070B1A]">
                Upper Intermediate
              </option>
              <option value="ADVANCED" className="bg-[#070B1A]">
                Advanced
              </option>
              <option value="PROFICIENT" className="bg-[#070B1A]">
                Proficient
              </option>
            </select>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProfileInformation;
