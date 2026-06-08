import { randomBytes } from "crypto";

export function createUnsubscribeToken(): string {
  return randomBytes(24).toString("hex");
}
