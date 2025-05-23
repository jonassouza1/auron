import retry from "async-retry";
import database from "@/infra/database";
import migrator from "@/models/migrator";

async function waitForAllServices() {
  await waitForWebServer();
}
async function clearDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function waitForWebServer() {
  return retry(fatchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
  });

  async function fatchStatusPage() {
    const response = await fetch("http://localhost:3000/api/v1/status");
    if (response.status !== 200) {
      throw Error();
    }
  }
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;
