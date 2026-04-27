import { Queue } from "bullmq";

export const auditQueue = new Queue("audit", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
