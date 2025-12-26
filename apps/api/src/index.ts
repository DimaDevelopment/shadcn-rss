import { Elysia } from "elysia";

import { syncRegistry, updateRegistriesState } from "@shadcnrss/sync";
import { getRegistries } from "@shadcnrss/registries";

import { checkRateLimit } from "../../../packages/sync/src/github";

const app = new Elysia()
  .get("/", () => {
    try {
      syncRegistry();
      return "Sync started";
    } catch (e) {
      console.error("Error starting sync:", e);
      return "Error starting sync";
    }
  })
  .get("/update", () => {
    try {
      updateRegistriesState();
      return "Update started";
    } catch (e) {
      console.error("Error starting update:", e);
      return "Error starting update";
    }
  })
  .get("/registries", (req) => {
    try {
      const query = req.query;

      return getRegistries({
        cursor: query.cursor ? Number(query.cursor) : null,
      });
    } catch (e) {
      console.error("Error starting update:", e);
      return "Error starting update";
    }
  })
  .get("/health", async () => {
    const rateLimit = await checkRateLimit();
    console.log("GitHub Rate Limit:", rateLimit);

    return rateLimit;
  })
  .listen(3322);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
