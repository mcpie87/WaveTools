export const IS_DEV = process.env.NODE_ENV === "development";

export const DEV_CONFIG = {
  map: {
    marker: {
      bypassIconCache: true,
      forceRerender: true,
    }
  }
}