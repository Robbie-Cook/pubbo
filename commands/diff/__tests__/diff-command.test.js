"use strict";

const execa = require("execa");
const fs = require("fs-extra");
const path = require("path");
const { getPackages } = require("@pubbo/project");

// mocked modules
const ChildProcessUtilities = require("@pubbo/child-process");

// helpers
const initFixture = require("@pubbo-test/init-fixture")(__dirname);
const gitAdd = require("@pubbo-test/git-add");
const gitCommit = require("@pubbo-test/git-commit");
const gitInit = require("@pubbo-test/git-init");
const gitTag = require("@pubbo-test/git-tag");

// file under test
const lernaDiff = require("@pubbo-test/command-runner")(require("../command"));

// stabilize commit SHA
expect.addSnapshotSerializer(require("@pubbo-test/serialize-git-sha"));

describe("DiffCommand", () => {
  // overwrite spawn so we get piped stdout, not inherited
  ChildProcessUtilities.spawn = jest.fn((...args) => execa(...args));

  it("should diff packages from the first commit", async () => {
    const cwd = await initFixture("basic");
    const [pkg1] = await getPackages(cwd);
    const rootReadme = path.join(cwd, "README.md");

    await pkg1.set("changed", 1).serialize();
    await fs.outputFile(rootReadme, "change outside packages glob");
    await gitAdd(cwd, "-A");
    await gitCommit(cwd, "changed");

    const { stdout } = await lernaDiff(cwd)();
    expect(stdout).toMatchSnapshot();
  });

  it("should diff packages from the most recent tag", async () => {
    const cwd = await initFixture("basic");
    const [pkg1] = await getPackages(cwd);

    await pkg1.set("changed", 1).serialize();
    await gitAdd(cwd, "-A");
    await gitCommit(cwd, "changed");
    await gitTag(cwd, "v1.0.1");

    await pkg1.set("sinceLastTag", true).serialize();
    await gitAdd(cwd, "-A");
    await gitCommit(cwd, "changed");

    const { stdout } = await lernaDiff(cwd)();
    expect(stdout).toMatchSnapshot();
  });

  it("should diff a specific package", async () => {
    const cwd = await initFixture("basic");
    const [pkg1, pkg2] = await getPackages(cwd);

    await pkg1.set("changed", 1).serialize();
    await pkg2.set("changed", 1).serialize();
    await gitAdd(cwd, "-A");
    await gitCommit(cwd, "changed");

    const { stdout } = await lernaDiff(cwd)("package-2");
    expect(stdout).toMatchSnapshot();
  });

  it("passes diff exclude globs configured with --ignored-changes", async () => {
    const cwd = await initFixture("basic");
    const [pkg1] = await getPackages(cwd);

    await pkg1.set("changed", 1).serialize();
    await fs.outputFile(path.join(pkg1.location, "README.md"), "ignored change");
    await gitAdd(cwd, "-A");
    await gitCommit(cwd, "changed");

    const { stdout } = await lernaDiff(cwd)("--ignore-changes", "**/README.md");
    expect(stdout).toMatchSnapshot();
  });

  it("should error when attempting to diff a package that doesn't exist", async () => {
    const cwd = await initFixture("basic");
    const command = lernaDiff(cwd)("missing");

    await expect(command).rejects.toThrow("Cannot diff, the package 'missing' does not exist.");
  });

  it("should error when running in a repository without commits", async () => {
    const cwd = await initFixture("basic");

    await fs.remove(path.join(cwd, ".git"));
    await gitInit(cwd);

    const command = lernaDiff(cwd)("package-1");
    await expect(command).rejects.toThrow("Cannot diff, there are no commits in this repository yet.");
  });

  it("should error when git diff exits non-zero", async () => {
    const cwd = await initFixture("basic");

    ChildProcessUtilities.spawn.mockImplementationOnce(() => {
      const nonZero = new Error("An actual non-zero, not git diff pager SIGPIPE");
      nonZero.code = 1;

      throw nonZero;
    });

    const command = lernaDiff(cwd)("package-1");
    await expect(command).rejects.toThrow("An actual non-zero, not git diff pager SIGPIPE");
  });
});
