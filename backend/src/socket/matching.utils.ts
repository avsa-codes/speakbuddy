import type { LanguageProficiency } from "./matchmaking.queue";

const proficiencyLevels: LanguageProficiency[] = [
  "BEGINNER",
  "ELEMENTARY",
  "INTERMEDIATE",
  "UPPER_INTERMEDIATE",
  "ADVANCED",
  "PROFICIENT",
];

export const getProficiencyScore = (
  proficiencyA: LanguageProficiency | null,
  proficiencyB: LanguageProficiency | null,
): number => {
  if (!proficiencyA || !proficiencyB) {
    return 0;
  }

  const indexA = proficiencyLevels.indexOf(proficiencyA);
  const indexB = proficiencyLevels.indexOf(proficiencyB);

  if ((indexA === 0 && indexB === 5) || (indexA === 5 && indexB === 0)) {
    return -1;
  }

  const difference = Math.abs(indexA - indexB);

  if (difference === 0) {
    return 3;
  }

  if (difference === 1) {
    return 2;
  }

  if (difference === 2) {
    return 1;
  }

  return 0;
};



export const getInterestsScore = (
  interestsA: readonly string[] | null,
  interestsB: readonly string[] | null,
): number => {
  if (!interestsA || !interestsB) {
    return 0;
  }

  const cleanInterestsA = interestsA.map((interest) =>
    interest
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(),
  );

  const cleanInterestsB = interestsB.map((interest) =>
    interest
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(),
  );

  const commonInterests = cleanInterestsA.filter((interest) =>
    cleanInterestsB.includes(interest),
  );

  return commonInterests.length;
};

export const getMatchScore = (
  proficiencyA: LanguageProficiency | null,
  proficiencyB: LanguageProficiency | null,
  interestsA: readonly string[] | null,
  interestsB: readonly string[] | null,
): number => {
  const proficiencyScore = getProficiencyScore(proficiencyA, proficiencyB);

  if (proficiencyScore === -1) {
    return -1;
  }

  const interestScore = getInterestsScore(interestsA, interestsB);

  return proficiencyScore + interestScore;
};