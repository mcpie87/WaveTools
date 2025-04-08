const exp = {
  5: 4400,
  10: 16500,
  15: 39600,
  20: 79100,
  25: 142600,
}
const TUNER_COUNT = 2261;
console.log("tuner count", TUNER_COUNT);
for (const [key, value] of Object.entries(exp)) {
  let tuners = TUNER_COUNT;
  let runs = 0;
  let current_exp = 0;
  let attempts = 0;
  while (tuners > 0) {
    // console.log("LOOP", key, tuners, runs, attempts, current_exp);
    ++runs;
    // waveplate use
    current_exp += 24000;
    tuners += 20;

    // try to upgrade as many times
    while (current_exp > value) {
      ++attempts;
      tuner_cost = 10 * (key / 5);
      // console.log("key", key, "subtracting", tuner_cost);
      tuners -= tuner_cost
      current_exp -= value;

      // refund
      tuners += (3/10) * tuner_cost;
      current_exp += (3/4) * value;
    }
  }
  console.log("lvl", key, "runs", runs, "attempts", attempts, "in 240 wplt days", runs / (240/60));
}
