const N = 1e6;
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
function pickSubstat(alreadyPicked) {
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

const UPGRADE_COST = {
  "+0": { tuners: 0, exp: 0 },
  "+5": { tuners: 10, exp: 4400 },
  "+10": { tuners: 20, exp: 16500 },
  "+15": { tuners: 30, exp: 39600 },
  "+20": { tuners: 40, exp: 79100 },
  "+25": { tuners: 50, exp: 142600 },
}

// endLevel - 0 means +0, 5 means +25
function simulate(desiredSubstats, pickedSubstats, endLevel) {
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

const results = {};
const ATTEMPTS = 1e5;
const desiredSubstats = [
  "crit_hit",
  "crit_damage",
  // "atk%",
  // "resonance_skill_dmg_bonus"
];
const startSubstats = [
  "crit_hit",
  "atk%",
  "flat_atk",
  "flat_def",
  // "basic_attack_dmg_bonus",
];
const startLevel = startSubstats.length;
for (let i = 0; i < ATTEMPTS; ++i) {
  for (let j = startLevel; j <= 5; ++j) {
    if (j < desiredSubstats.length) {
      continue;
    }
    const pickedSubstats = [...startSubstats];
    // console.log("FOR", desiredSubstats, pickedSubstats, i, j);
    const result = simulate(desiredSubstats, pickedSubstats, j);
    if (!results[j]) {
      results[j] = 0;
    }
    if (result) {
      results[j]++;
    }
  }
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

console.log("Desired substats:", desiredSubstats.length, desiredSubstats);
console.log("Start substats", startSubstats.length, startSubstats);
console.log(`Attempt count: ${formatNumber(ATTEMPTS)}`);
console.log("                   Expected  |        Tuners            |           EchoEXP")
console.log("Lvl   Chance       Attempts  |   Expec.  |    Waveplate |      Exp.    |    Waveplate")
for (const [k, v] of Object.entries(results)) {
  const chanceToHit = v / ATTEMPTS;
  const displayedLevel = "+" + (5 * k);
  const displayedStartLevel = "+" + (5 * startLevel);
  const expectedAttempts = 1 / chanceToHit;
  const expectedTuners = expectedAttempts * (UPGRADE_COST[displayedLevel].tuners - UPGRADE_COST[displayedStartLevel].tuners);
  const expectedExperience = expectedAttempts * (UPGRADE_COST[displayedLevel].exp - UPGRADE_COST[displayedStartLevel].exp);

  const waveplateCost = 60;
  const waveplateTunerReward = 20;
  const waveplateExpReward = 24000;
  const expectedWaveplateForTuner = expectedTuners * (waveplateCost / waveplateTunerReward);
  const expectedWaveplateForExp = expectedExperience * (waveplateCost / waveplateExpReward);

  let out = `${displayedLevel.padStart(3)}`;
  out += `: ${chanceToHit.toString().padStart(8)}`;
  if (v > 0) {
    out += ` | ${formatNumber(expectedAttempts.toFixed(2)).padStart(12)}`;
    out += ` | ${formatNumber(expectedTuners.toFixed(0)).padStart(9)}`;
    out += ` | ${formatNumber(expectedWaveplateForTuner.toFixed(0)).padStart(12)}`;
    out += ` | ${formatNumber(expectedExperience.toFixed(0)).padStart(12)}`;
    out += ` | ${formatNumber(expectedWaveplateForExp.toFixed(0)).padStart(12)}`;
  }
  console.log(out);
}