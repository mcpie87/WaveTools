import { TranslationMapEntry } from "./TranslationMapInterface";

export enum EnemyChallenges {
  // 3.3
  TWIN_NOVA_COLLAPSAR_BLADE = "Twin Nova: Collapsar Blade",
  ROYAN_WOMAN = "Royan Woman",
  ROYAN_MAN = "Royan Man",
  SABERCAT_PROWLER = "Sabercat Prowler",
}

const EnemyChallengesTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  // 3.3
  [EnemyChallenges.TWIN_NOVA_COLLAPSAR_BLADE]: {
    key: "ENEMY_CHALLENGE_TWIN_NOVA_COLLAPSAR_BLADE",
    keys: [
      "branch3.3_607_Monster5", // might be the other type
      "branch3.3_607_Monster4", // might be the other type
    ]
  },
  [EnemyChallenges.ROYAN_WOMAN]: {
    key: "ENEMY_CHALLENGE_ROYAN_WOMAN",
    keys: [
      "branch3.3_607_Monster_Branch3.0_013",
    ]
  },
  [EnemyChallenges.ROYAN_MAN]: {
    key: "ENEMY_CHALLENGE_ROYAN_MAN",
    keys: [
      "branch3.3_607_Monster_Branch3.0_012",
    ]
  },
  [EnemyChallenges.SABERCAT_PROWLER]: {
    key: "ENEMY_CHALLENGE_SABERCAT_PROWLER",
    keys: [
      "branch3.3_607_Monster_monster3_3",
      "branch3.3_607_Monster_monster3_5",
    ]
  },
}

export const EnemyChallengesTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(EnemyChallengesTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();

export const EnemyChallengesDisplayOrder = Object.values(EnemyChallenges);
