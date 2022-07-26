import * as core from "@actions/core";
import * as github from "@actions/github";
import { approve } from "./approve";

function numberOrUndefined(n: number): number | undefined {
  return Number.isNaN(n) ? undefined : n;
}

async function run() {
  try {
    const token = core.getInput("github-token", { required: true });
    const prNumber: number = parseInt(core.getInput("pull-request-number"), 10);
    const maxRetries: number = parseInt(core.getInput("max-retries"), 10);
    const commitSha: string = core.getInput("commit-sha");
    await approve(
      token,
      github.context,
      commitSha,
      numberOrUndefined(prNumber),
      numberOrUndefined(maxRetries)
    );
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Unknown error");
    }
  }
}

run();
