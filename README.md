# Wait For Commit GitHub Action

**Name:** `inarix/wait-for-commit`

Automatically check if a commit is synchronized on a GitHub pull requests. The `GITHUB_TOKEN` secret must be provided as the `github-token` input for the action to work.

## Usage instructions

Create a workflow file (e.g. `.github/workflows/wait-for-commit.yml`) that contains a step that `uses: inarix/wait-for-commit@v1`. Here's an example workflow file:

```yaml
name: Wait for commit
on: pull_request_target

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
    - uses: inarix/wait-for-commit@v1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        commit-sha: abcdef
```


Combine with an `if` clause to only auto-approve certain users. For example, to wait-for-commit [Dependabot][dependabot] pull requests, use:

```yaml
name: Wait for commit

on:
  pull_request

jobs:
  auto-approve:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
    - uses: inarix/wait-for-commit@v1
      if: github.actor == 'dependabot[bot]'
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        commit-sha: abcdef
```

If you want to use this action from a workflow file that doesn't run on the `pull_request` or `pull_request_target` events, use the `pull-request-number` input:

```yaml
name: Wait for commit

on:
  workflow_dispatch:
    inputs: pullRequestNumber
      description: Pull request number to wait for commit
      required: false

jobs:
  wait-for-commit:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
    - uses: inarix/wait-for-commit@v1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        pull-request-number: ${{ github.event.inputs.pullRequestNumber }}
        commit-sha: abcdef
```

## Why?

While using `hmarr/auto-approve@v2` Github action with an auto-commit before hand, sometimes Github doesn't synchronize on time before auto-approve is ran. Therefore, we wanted a step to check if the commit has been synchronized before auto approving a pull request.

## Code owners

If you're using a [CODEOWNERS file](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners), you'll need to give this action a personal access token for a user listed as a code owner. Rather than using a real user's personal access token, you're probably better off creating a dedicated bot user, and adding it to a team which you assign as the code owner. That way you can restrict the bot user's permissions as much as possible, and your workflow won't break when people leave the team.
