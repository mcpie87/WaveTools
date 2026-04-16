type HydrateFn = () => void;
const registry = new Set<HydrateFn>();

export const registerStore = (hydrate: HydrateFn) => {
  registry.add(hydrate);
};

export const hydrateRegisteredStores = () => {
  registry.forEach((hydrate) => hydrate());
  registry.clear(); // prevent double hydration
};