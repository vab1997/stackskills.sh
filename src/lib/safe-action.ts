import { logger } from "@/lib/logger";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e.message) return e.message;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next, clientInput }) => {
  const startTime = performance.now();
  logger.info({ input: clientInput }, "▴ Action started");

  const result = await next();
  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);
  logger.info({ duration, result }, "Action completed");
  return result;
});
