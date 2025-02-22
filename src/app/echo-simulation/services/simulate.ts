const CHANCE = (1 / 13)
const substatsDict = {
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
export function pickSubstat(alreadyPicked: string[]) {
  const substatsMap = new Map(Object.entries(substatsDict));
  for (const pickedSubstat of alreadyPicked) {
    if (substatsMap.get(pickedSubstat)) {
      substatsMap.delete(pickedSubstat);
    }
  }
  const substatsArr = Array.from(substatsMap);
  const totalChance = substatsArr.reduce((acc, [, subChance]) => acc + subChance, 0);

  let rng = Math.random() * totalChance;
  for (const [possibleSubstat, possibleSubstatChance] of substatsArr) {
    rng -= possibleSubstatChance;
    if (rng < 0) {
      return possibleSubstat;
    }
  }
  throw new Error("Well shit");
}

export const SUBSTATS = Object.keys(substatsDict);

export const UPGRADE_COST = {
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
    const pickedSubstat = pickSubstat(pickedSubstats);
    pickedSubstats.push(pickedSubstat);
  }

  for (const desiredSubstat of desiredSubstats) {
    if (!pickedSubstats.includes(desiredSubstat)) {
      return false;
    }
  }
  return true;
}