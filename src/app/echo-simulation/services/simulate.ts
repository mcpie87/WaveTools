const CHANCE = (1 / 13)

export type Substat = keyof typeof substatsDict;
const substatsDict: { [key: string]: number } = {
  "flat_atk": CHANCE,
  "flat_hp": CHANCE,
  "flat_def": CHANCE,
  "atk%": CHANCE,
  "hp%": CHANCE,
  "def%": CHANCE,
  "energy_regen": CHANCE,
  "crit_hit": CHANCE,
  "crit_damage": CHANCE,
  "basic_attack_dmg_bonus": CHANCE,
  "heavy_attack_dmg_bonus": CHANCE,
  "resonance_skill_dmg_bonus": CHANCE,
  "resonance_liberation_dmg_bonus": CHANCE,
};
// deepseek
function pickSubstat(pickedSubstats: string[]): string {
  let totalChance = 0;
  const available = [];

  for (const substat in substatsDict) {
    if (!pickedSubstats.includes(substat)) {
      available.push(substat);
      totalChance += substatsDict[substat];
    }
  }

  if (available.length === 0) {
    throw new Error("No more subs available");
  }

  const random = Math.random() * totalChance;
  let cumulative = 0;

  for (let i = 0; i < available.length; i++) {
    cumulative += substatsDict[available[i]];
    if (random <= cumulative) {
      return available[i];
    }
  }

  // This fallback should never be reached if the logic is correct
  throw new Error("Unable to pick substat");
}

// export function pickSubstat(alreadyPicked: string[]) {
//   const substatsMap = new Map(Object.entries(substatsDict));
//   for (const pickedSubstat of alreadyPicked) {
//     if (substatsMap.get(pickedSubstat)) {
//       substatsMap.delete(pickedSubstat);
//     }
//   }

//   const substatsArr = Array.from(substatsMap);
//   const totalChance = substatsArr.reduce((acc, [, subChance]) => acc + subChance, 0);

//   let rng = Math.random() * totalChance;
//   for (const [possibleSubstat, possibleSubstatChance] of substatsArr) {
//     rng -= possibleSubstatChance;
//     if (rng < 0) {
//       return possibleSubstat;
//     }
//   }
//   throw new Error("Well shit");
//   // // Convert alreadyPicked array to a Set for O(1) lookup time
//   // const pickedSet = new Set(alreadyPicked);

//   // // Calculate total chance and store remaining substats in one loop
//   // let totalChance = 0;
//   // const remainingSubstats: { substat: string, chance: number }[] = [];

//   // for (const [substat, chance] of Object.entries(substatsDict)) {
//   //   if (!pickedSet.has(substat)) {
//   //     remainingSubstats.push({ substat, chance });
//   //     totalChance += chance; // Accumulate total chance
//   //   }
//   // }

//   // // If no substats remain, throw an error
//   // if (remainingSubstats.length === 0) {
//   //   throw new Error("No substats available to pick");
//   // }

//   // // Generate a random number and select the corresponding substat
//   // let rng = Math.random() * totalChance;
//   // for (const { substat, chance } of remainingSubstats) {
//   //   rng -= chance;
//   //   if (rng < 0) {
//   //     return substat;
//   //   }
//   // }

//   // // This fallback should never be reached if the logic is correct
//   // throw new Error("Unable to pick substat");
// }

export const SUBSTATS = Object.keys(substatsDict);

interface UpgradeCost {
  tuners: number;
  exp: number;
}
export const UPGRADE_COST: { [key: string]: UpgradeCost } = {
  "+0": { tuners: 0, exp: 0 },
  "+5": { tuners: 10, exp: 4400 },
  "+10": { tuners: 20, exp: 16500 },
  "+15": { tuners: 30, exp: 39600 },
  "+20": { tuners: 40, exp: 79100 },
  "+25": { tuners: 50, exp: 142600 },
}


// endLevel - 0 means +0, 5 means +25
export function simulate(desiredSubstats: string[], pickedSubstats: string[], endLevel: number) {
  for (let i = pickedSubstats.length; i < endLevel; ++i) {
    const pickedSubstat: string = pickSubstat(pickedSubstats);
    pickedSubstats.push(pickedSubstat);
  }

  for (const desiredSubstat of desiredSubstats) {
    if (!pickedSubstats.includes(desiredSubstat)) {
      return false;
    }
  }
  return true;
}