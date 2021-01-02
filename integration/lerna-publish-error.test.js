"use strict";

const path = require("path");

const cliRunner = require("@pubbo-test/cli-runner");
const cloneFixture = require("@pubbo-test/clone-fixture")(
  path.resolve(__dirname, "../commands/publish/__tests__")
);

test("lerna publish sets correct exit code when libnpmpublish fails", async () => {
  const { cwd } = await cloneFixture("normal");

  await expect(
    cliRunner(cwd)("publish", "patch", "--yes", "--no-verify-access", "--loglevel", "error")
  ).rejects.toThrow(
    expect.objectContaining({
      stderr: expect.stringContaining("E401 You must be logged in to publish packages."),
      code: 1,
    })
  );
});
