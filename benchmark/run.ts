import { spawn } from "child_process";
import autocannon from "autocannon";
import { SERVERS } from "./servers";
import { writeFileSync } from "fs";

const run = async (command: string, args: string[], port: number) => {
  const server = spawn(command, args, {
    detached: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log(`
Running benchmark for ${command} ${args.join(" ")}`);

  const result = await autocannon({
    url: `http://localhost:${port}`,
    connections: 10,
    pipelining: 1,
    duration: 10,
  });

  if (server.pid) {
    process.kill(-server.pid);
  }

  return result;
};

const main = async () => {
  const results = [];

  for (const server of SERVERS) {
    const result = await run(server.command, server.args, server.port);
    results.push({ server: server.name, requests: result.requests.average, latency: result.latency.average });
  }

  console.log("\nBenchmark Results:");
  console.table(results);

  writeFileSync("benchmark/results.json", JSON.stringify(results, null, 2));
  console.log("\nBenchmark results saved to benchmark/results.json");
};

main();
