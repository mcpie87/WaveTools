type HydrateFn = () => void;
const registry = new Set<HydrateFn>();

export const registerStore = (hydrate: HydrateFn) => {
  console.log(`[StoreRegistry] Registering store ${hydrate.toString()}`);
  registry.add(hydrate);
};

export const hydrateRegisteredStores = () => {
  console.log(`[StoreRegistry] Hydrating ${registry.size} stores...`);
  registry.forEach((hydrate) => hydrate());
};