import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "themis",
  isDev: process.env.NODE_ENV === "development",
});
