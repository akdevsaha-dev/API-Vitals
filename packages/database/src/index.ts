export const db = {
  connect: () => console.log("Connected to API Vitals Database"),
  query: (sql: string) => console.log(`Executing: ${sql}`),
};

export type Database = typeof db;
