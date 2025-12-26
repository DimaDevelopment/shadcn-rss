import { gh } from "@shadcnrss/gh";
import {
  RegistryItemCommit,
  RegistryItemCommitSchema,
  RegistryRepoMetadata,
  RegistryRepoMetadataSchema,
} from "./schemas.js";
import { subDays } from "date-fns";

export const getRepoOwnerAndName = (repo: string) => {
  const repourl = URL.canParse(repo) ? new URL(repo) : null;

  if (!repourl) {
    return null;
  }

  const [owner, name] = repourl.pathname.split("/").filter(Boolean);

  if (!owner || !name) {
    return null;
  }

  return { owner, name };
};

export const fetchRepoInfo = async (repoUrl?: string) => {
  if (!repoUrl) return null;

  const repo = getRepoOwnerAndName(repoUrl);

  if (!repo) return null;

  const metadata = await fetchRepoMetadata(repo.owner, repo.name, repoUrl);

  return metadata;
};

const fetchRepoMetadata = async (
  owner: string,
  repo: string,
  repoUrl: string
): Promise<RegistryRepoMetadata | null> => {
  try {
    const repository = await gh.rest.repos.get({
      owner,
      repo,
    });

    return RegistryRepoMetadataSchema.parseAsync({
      owner,
      repoId: repository.data.id,
      url: repoUrl,
      name: repo,
      stars: repository.data.stargazers_count,
      forks: repository.data.forks_count,
      issues: repository.data.open_issues_count,
      watchers: repository.data.watchers_count,
      openIssues: repository.data.open_issues_count,
      archived: repository.data.archived,

      repoCreatedAt: new Date(repository.data.created_at),
      repoUpdatedAt: new Date(repository.data.updated_at),
      repoPushedAt: repository.data.pushed_at
        ? new Date(repository.data.pushed_at)
        : undefined,

      license: repository.data.license
        ? repository.data.license.spdx_id
        : undefined,
    });
  } catch (error) {
    console.error(
      `Failed to fetch repo metadata for ${owner}/${repo}: ${error}`
    );
    return null;
  }
};

export const fetchItemCommits = async (
  owner: string,
  repo: string,
  file: string
): Promise<RegistryItemCommit[]> => {
  const since = subDays(new Date(), 30).toISOString();

  try {
    const commits = await gh.rest.repos.listCommits({
      owner,
      repo,
      since,
      path: file,
    });

    return RegistryItemCommitSchema.array().parseAsync(
      commits.data.map((commit) => ({
        commitSha: commit.sha,
        message: commit.commit.message,
        url: commit.html_url,
        date: new Date(
          commit.commit.author?.date ?? commit.commit.committer?.date ?? ""
        ),
      }))
    );
  } catch (error) {
    return [];
  }
};

export const checkRateLimit = async () => {
  const rateLimit = await gh.rest.rateLimit.get();

  return {
    ...rateLimit.data.rate,
    resetAt: new Date(rateLimit.data.rate.reset * 1000),
  };
};
