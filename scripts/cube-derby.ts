type Position = number;
type Contestant = string;

type ContestantConfig = {
  rollDice?: () => number; // Custom dice roll logic
  modifyRoll?: (roll: number, race: RaceTrack, stackIndex: number, stack: Contestant[]) => number; // Modify roll based on conditions
  onLand?: (race: RaceTrack, pos: Position, name: Contestant) => void; // When others land on this contestant's position
  afterMove?: (race: RaceTrack) => void;
};

function getLast(race: RaceTrack): Contestant {
  const contestants = Array.from(race.positionMap.entries()).sort((a, b) => b[1] - a[1]);
  if (contestants[0][1] < contestants[1][1]) return contestants[0][0];
  return race.positions[contestants[0][1]][0];
}

function willPassOthers(race: RaceTrack, name: Contestant, roll: number): boolean {
  const pos = race.positionMap.get(name)!;
  for (let i = 1; i <= roll && pos + i < race.positions.length; ++i) {
    if (race.positions[pos + i].length > 0) {
      return true;
    }
  }
  return false;
}

const contestantConfigs: Record<Contestant, ContestantConfig> = {
  Jinhsi: {
    // "If other Cubes are stacked on top of Jinhsi, there is a 40% chance she will move to the top of the stack."
    onLand: (race, pos) => {
      const stack = race.positions[pos];
      const jIndex = stack.indexOf("Jinhsi");
      if (jIndex !== -1 && Math.random() < 0.4) {
        const [jinhsi] = stack.splice(jIndex, 1);
        stack.push(jinhsi); // Move to top
      }
    },
  },
  Changli: {
    // Special logic, needs to be done manually in code
  },
  Calcharo: {
    modifyRoll: (roll, race) => {
      // Mistranslated description
      // "If Calcharo is the last to move, he advances 3 extra pads."

      // if (race.lastToMove !== "Calcharo") return roll;
      // return roll + 3;

      // Actual description:
      // "When ranked last, <color=Highlight>advance 3 extra pads</color>."
      if (getLast(race) === "Calcharo") return roll + 3;
      return roll;
    },
  },
  Shorekeeper: {
    rollDice: () => Math.floor(Math.random() * 2) + 2, // 2 or 3
  },
  Camellya: {
    modifyRoll: (roll, race, stackIndex, stack) => {
      if (Math.random() < 0.5) {
        return roll + (stack.length - 1);
      }
      return roll;
    },
  },
  Carlotta: {
    modifyRoll: (roll) => (Math.random() < 0.28 ? roll * 2 : roll),
  },
  Roccia: {
    // "If Roccia is the last to move, she advances 2 extra pads."
    modifyRoll: (roll, race) => {
      if (race.lastToMove !== "Roccia") return roll;
      return roll + 2;
    },
  },
  Brant: {
    // "If Brant is the first to move, he advances 2 extra pads."
    modifyRoll: (roll, race) => {
      if (race.firstToMove !== "Brant") return roll;
      return roll + 2;
    },
  },
  Cantarella: {
    // "The first time Cantarella passes by other Cubes, she stacks with them and carries them forward. This can only be triggered once per match."

  },
  Zani: {
    // "The dice will only roll a 1 or 3. When moving with other Cubes stacking above, there is a 40% chance to advance 2 extra pads next turn."
    rollDice: () => Math.random() < 0.5 ? 1 : 3,
    modifyRoll: (roll, race, stackIndex, stack) => {
      if (race.nextTurnZaniSpecial) {
        roll = roll + 2;
      }

      race.nextTurnZaniSpecial = Math.random() < 0.4 && stackIndex < stack.length - 1;
      return roll;
    },
  },
  Cartethyia: {
    // "If ranked last after own action, there is a 60% chance to advance 2 extra pads in all remaining turns.
    // This can only be triggered once in each match."
    modifyRoll: (roll, race) => {
      if (race.cartethyiaSpecialActive) return roll + 2;
      return roll;
    },
    afterMove: (race) => {
      if (!race.cartethyiaSpecialActive && getLast(race) === "Cartethyia") {
        race.cartethyiaSpecialActive = Math.random() < 0.6;
      }
    },
  },
  Phoebe: {
    // "There is a 50% chance to advance an extra pad."
    modifyRoll: (roll) => {
      if (Math.random() < 0.5) return roll + 1;
      return roll;
    }
  }
};

interface StartSettings {
  nextTurnLast?: Contestant;
  nextTurnZaniSpecial?: boolean;
  cartethyiaSpecialActive?: boolean;
  cantarellaSpecialTriggered?: boolean;
}
export class RaceTrack {
  positions: Contestant[][] = Array.from({ length: MAP_SIZE }, () => []); // bottom = 0, top = n
  positionMap: Map<Contestant, Position> = new Map();
  moveOrder: Contestant[] = [];
  lastToMove: Contestant | null = null;
  firstToMove: Contestant | null = null;
  nextTurnLast: Contestant | null = null;
  nextTurnZaniSpecial: boolean = false;
  cartethyiaSpecialActive: boolean = false;
  cantarellaSpecialTriggered: boolean = false;

  constructor(
    mapSize: number,
    initialPositions: Map<Contestant, Position>,
    skipFirstTurnConditions: boolean = false,
    startSettings: StartSettings = {}
  ) {
    this.positions = Array.from({ length: mapSize }, () => []);
    for (const [name, pos] of initialPositions) {
      // this.positions[pos].push(name);
      this.positionMap.set(name, pos);
    }
    if (startSettings.nextTurnLast) {
      this.nextTurnLast = startSettings.nextTurnLast;
    }
    if (startSettings.nextTurnZaniSpecial !== undefined) {
      this.nextTurnZaniSpecial = startSettings.nextTurnZaniSpecial;
    }
    if (startSettings.cartethyiaSpecialActive !== undefined) {
      this.cartethyiaSpecialActive = startSettings.cartethyiaSpecialActive;
    }
    if (startSettings.cantarellaSpecialTriggered !== undefined) {
      this.cantarellaSpecialTriggered = startSettings.cantarellaSpecialTriggered;
    }
    if (skipFirstTurnConditions) {
      // order matters so we have to add them here
      this.generateMoveOrder();
      for (const [name, pos] of initialPositions) {
        this.positions[pos].push(name);
      }
    }
  }

  rollDice(contestant: Contestant): number {
    const config = contestantConfigs[contestant];
    return config?.rollDice ? config.rollDice() : Math.floor(Math.random() * 3) + 1;
  }

  generateMoveOrder() {
    this.moveOrder = Array.from(this.positionMap.keys());
    for (let i = this.moveOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.moveOrder[i], this.moveOrder[j]] = [this.moveOrder[j], this.moveOrder[i]];
    }
  }

  runTurn() {
    const isFirstRound = this.moveOrder.length === 0;
    // 1. Shuffle contestants for random unique order
    this.generateMoveOrder();
    const contestants = this.moveOrder;
    if (isFirstRound) {
      for (const name of [...contestants].reverse()) {
        this.positions[0].push(name);
      }
    }

    // Apply Changli's effect from previous turn
    if (this.nextTurnLast) {
      const index = contestants.indexOf(this.nextTurnLast);
      if (index !== -1) {
        const [changli] = contestants.splice(index, 1);
        contestants.push(changli);
      }
      this.nextTurnLast = null;
    }
    this.firstToMove = contestants[0];
    this.lastToMove = contestants[contestants.length - 1];

    // 2. Process each contestant's move in order
    for (const name of contestants) {
      let roll = this.rollDice(name);
      const pos = this.positionMap.get(name)!;
      const stack = this.positions[pos];
      const index = stack.indexOf(name);
      const config = contestantConfigs[name];

      if (config?.modifyRoll) {
        roll = config.modifyRoll(roll, this, index, stack);
      }

      this.move(name, roll);
    }

    // Changli: 65% chance to be last next turn if others below
    const changliPos = this.positionMap.get("Changli");
    if (!changliPos) return;
    const stack = this.positions[changliPos];
    const changliIdx = stack.indexOf("Changli");
    this.nextTurnLast = changliIdx > 0 && Math.random() < 0.65 ? stack[changliIdx] : null;
  }

  move(contestant: Contestant, roll: number) {
    const currentPos = this.positionMap.get(contestant);
    if (currentPos === undefined) return;
    const newPos = Math.min(currentPos + roll, this.positions.length - 1);

    const stack = this.positions[currentPos];
    const index = stack.indexOf(contestant);
    let movingGroup = stack.splice(index);

    const activateCantarellaSpecial = !this.cantarellaSpecialTriggered && contestant === "Cantarella" && willPassOthers(this, contestant, newPos - currentPos);
    if (activateCantarellaSpecial) {
      this.cantarellaSpecialTriggered = true;
      // Special cantarella move // too lazy to overthink this
      // The only weird one is onLand on Jinhsi - Canta draggin Jinhsi -> does it trigger Jinhsi onland?
      for (let i = 1; i < roll; ++i) {
        // We drag only first stack of cubes we get to
        if (this.positions[currentPos + i].length > 0) {
          movingGroup = [...this.positions[currentPos + i], ...movingGroup];
          break;
        }
      }
    } else {
      for (const other of this.positions[newPos]) {
        const config = contestantConfigs[other];
        if (config?.onLand) {
          config.onLand(this, newPos, contestant);
        }
      }
    }

    this.positions[newPos].push(...movingGroup);
    for (const name of movingGroup) {
      this.positionMap.set(name, newPos);
    }
    const config = contestantConfigs[contestant];
    if (config?.afterMove) {
      config.afterMove(this);
    }
  }

  getState() {
    return this.positions
      .map((pad, i) => ({ pad: i, stack: [...pad] }))
      .filter((p) => p.stack.length);
  }

  hasWinner(): Contestant | null {
    const finalPad = this.positions[this.positions.length - 1];
    return finalPad.length ? finalPad[finalPad.length - 1] : null;
  }

  getWinnersOrder(): Contestant[] {
    const ranked: { contestant: Contestant; pos: number; stackRank: number }[] = [];

    for (const [contestant, pos] of this.positionMap.entries()) {
      const stack = this.positions[pos];
      const stackRank = stack.indexOf(contestant); // 0 is bottom, higher index is higher rank
      ranked.push({ contestant, pos, stackRank });
    }

    ranked.sort((a, b) => {
      if (a.pos !== b.pos) return b.pos - a.pos; // Higher position wins
      return b.stackRank - a.stackRank; // Higher in stack wins
    });

    return ranked.map(r => r.contestant);
  }
}

const N = 1e5;
const MAP_SIZE = 24;
const LAPS = 2;

const getMatchWinners = (bracket: Contestant[]) => {
  const race = new RaceTrack(
    MAP_SIZE * LAPS, // we start on 1st pad, not "start"
    new Map(bracket.map((contestant) => [contestant, 0]))
  );
  while (!race.hasWinner()) {
    race.runTurn();
  }

  return race.getWinnersOrder();
}

const getMatchWinnersFromPositions = (bracket: Map<Contestant, number>, options: StartSettings = {}) => {
  const race = new RaceTrack(
    MAP_SIZE * LAPS + 1, // 1 for last pad
    bracket,
    true,
    options
  );
  while (!race.hasWinner()) {
    race.runTurn();
  }

  return race.getWinnersOrder();
}

const getResults = (bracket: Contestant[]) => {
  const winnersCount: Record<string, number> = {};
  for (let i = 0; i < N; ++i) {
    const winners = getMatchWinners(bracket);
    winnersCount[winners[0]] = (winnersCount[winners[0]] ?? 0) + 1;
  }
  return Object.entries(winnersCount).sort((a, b) => b[1] - a[1]);
}

const getResultsFromPositions = (bracket: Map<Contestant, number>, options: StartSettings = {}) => {
  const winnersCount: Record<string, number> = {};
  for (let i = 0; i < N; ++i) {
    const winners = getMatchWinnersFromPositions(bracket, options);
    winnersCount[winners[0]] = (winnersCount[winners[0]] ?? 0) + 1;
  }
  return Object.entries(winnersCount).sort((a, b) => b[1] - a[1]);
}

const simulateTournament = (bracket0: Contestant[], bracket1: Contestant[]) => {
  const quarterFinals1 = getMatchWinners(bracket0).slice(0, 4);
  const quarterFinals2 = getMatchWinners(bracket1).slice(0, 4);
  const semiFinals1 = getMatchWinners(quarterFinals1).slice(0, 2);
  const semiFinals2 = getMatchWinners(quarterFinals2).slice(0, 2);
  const finals = getMatchWinners([...semiFinals1, ...semiFinals2]);
  const winner = finals[0];

  return winner;
}
const getTournamentWinner = (bracket0: Contestant[], bracket1: Contestant[]) => {
  const winnersCount: Record<string, number> = {};
  for (let i = 0; i < N; ++i) {
    const winner = simulateTournament(bracket0, bracket1);
    winnersCount[winner] = (winnersCount[winner] ?? 0) + 1;
  }
  return Object.entries(winnersCount).sort((a, b) => b[1] - a[1]);
}

const bracket0 = [
  "Jinhsi",
  "Changli",
  "Calcharo",
  "Shorekeeper",
  "Camellya",
  "Carlotta",
]
const bracket1 = [
  "Zani",
  "Phoebe",
  "Cartethyia",
  "Cantarella",
  "Roccia",
  "Brant",
]

const customBracket = [
  "Calcharo",
  "Cartethyia",
]

// EU 2025-05-14 finish
const setupBracketEU = new Map<string, number>([
  ["Carlotta", 25],
  ["Shorekeeper", 24],
  ["Calcharo", 24],
  ["Jinhsi", 23],
  ["Changli", 23],
  ["Camellya", 22],
]);
const setupBracketNA = new Map<string, number>([
  ["Calcharo", 25],
  ["Carlotta", 24],
  ["Camellya", 24],
  ["Jinhsi", 23],
  ["Shorekeeper", 23],
  ["Changli", 22],
]);

const leftBracketEU = [
  "Jinhsi",
  "Shorekeeper",
  "Carlotta",
  "Calcharo",
]
const leftBracketNA = [
  "Camellya",
  "Jinhsi",
  "Carlotta",
  "Calcharo",
];
const leftBracketSEA = [
  "Calcharo",
  "Shorekeeper",
  "Changli",
  "Camellya",
]
const rightBracketEU = [
  "Roccia",
  "Brant",
  "Phoebe",
  "Cantarella",
]
const setupLeftBracketSEA = new Map<string, number>([
  ["Calcharo", 24],
  ["Changli", 23],
  ["Shorekeeper", 23],
  ["Camellya", 22],
]);
const setupLeftBracketEU = new Map<string, number>([
  ["Jinhsi", 23],
  ["Calcharo", 20],
  ["Shorekeeper", 20],
  ["Carlotta", 15],
]);
const setupLeftBracketNA = new Map<string, number>([
  ["Jinhsi", 23],
  ["Camellya", 22],
  ["Calcharo", 22],
  ["Carlotta", 21],
]);
const setupRightBracketEU = new Map<string, number>([
  ["Roccia", 23], // ["Roccia", 23],
  ["Cantarella", 22], // ["Cantarella", 22],
  ["Phoebe", 22], // ["Phoebe", 23],
  ["Brant", 21], // ["Brant", 13],
]);
const setupRightBracketNA = new Map<string, number>([
  ["Roccia", 23],
  ["Brant", 22],
  ["Phoebe", 22],
  ["Zani", 21],
]);

const finalBracketEU = [
  "Calcharo",
  "Carlotta",
  "Roccia",
  "Cantarella",
]

const finalBracketSEA = [
  "Shorekeeper",
  "Camellya",
  "Cartethyia",
  "Cantarella",
]

const setupFinalBracketEU = new Map<string, number>([
  ["Carlotta", 23],
  ["Cantarella", 22],
  ["Calcharo", 22],
  ["Roccia", 21],
]);

// const entries = getTournamentWinner(bracket0, bracket1);
// const entries = getResults(bracket0);
// const entries = getResults(bracket1);
// const entries = getResults(customBracket);
// const entries = getResultsFromPositions(setupBracketEU)
// const entries = getResultsFromPositions(setupBracketNA)
// const entries = getResults(leftBracketEU);
// const entries = getResults(leftBracketNA);
// const entries = getResults(leftBracketSEA);
// const entries = getResults(rightBracketEU);
// const entries = getResults(finalBracketEU);
// const entries = getResults(finalBracketSEA);
// const entries = getResultsFromPositions(setupLeftBracketSEA);
// const entries = getResultsFromPositions(setupLeftBracketEU);
// const entries = getResultsFromPositions(setupLeftBracketNA);
// const entries = getResultsFromPositions(setupRightBracketNA);
const entries = getResultsFromPositions(setupFinalBracketEU);
// EU 2025-05-16 finish
// const entries = getResultsFromPositions(new Map<string, number>([
//   ["Roccia", 23],
//   ["Cantarella", 22],
//   ["Brant", 21],
//   ["Phoebe", 20],
//   ["Zani", 18],
//   ["Cartethyia", 16],
// ]), {
//   // nextTurnZaniSpecial: true,
//   // cartethyiaSpecialActive: true,
//   // cantarellaSpecialTriggered: true
// });
// SEA 2025-05-16 finish
// const entries = getResultsFromPositions(new Map<string, number>([
//   ["Brant", 23],
//   ["Phoebe", 22],
//   ["Zani", 22],
//   ["Roccia", 21],
//   ["Cartethyia", 21],
//   ["Cantarella", 20],
// ]), {
//   // nextTurnZaniSpecial: true,
//   cartethyiaSpecialActive: true,
//   cantarellaSpecialTriggered: true
// });

// NA 2025-05-16
// const entries = getResultsFromPositions(new Map<string, number>([
//   ["Zani", 23],
//   ["Cantarella", 23],
//   ["Roccia", 22],
//   ["Cartethyia", 20],
//   ["Brant", 19],
//   ["Phoebe", 16],
// ]), {
//   // nextTurnZaniSpecial: true,
//   // cartethyiaSpecialActive: false,
//   // cantarellaSpecialTriggered: true
// });


console.log("Map size:", MAP_SIZE);
console.log("Laps:", LAPS);
console.log("Sample count:", N);
const maxLength = Math.max(...Object.values(entries).map(e => e[0].length));
for (let i = 0; i < entries.length; ++i) {
  const [name, count] = entries[i];
  const chance = (count / N * 100);
  console.log(`${(i + 1).toString().padStart(2)}: ${name.padEnd(maxLength + 1)} - ${chance.toFixed(2).padStart(5)}%`);
}