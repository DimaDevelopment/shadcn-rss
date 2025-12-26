import * as z from "zod";

export const RegistrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  url: z.string(),
  description: z.string(),
  repo: z.string().optional(),
});

export const RegistryItemTypeEnum = z.enum([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:page",
  "registry:file",
  "registry:theme",
  "registry:style",
  "registry:item",
  "registry:base",
  "registry:font",

  // Internal use only.
  "registry:example",
  "registry:internal",
]);

export const RegistryItemFileSchema = z.object({
  path: z.string(),
  type: RegistryItemTypeEnum.optional(),
});

export const RegistryItemSchema = z.object({
  name: z.string(),
  type: RegistryItemTypeEnum.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  registryDependencies: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  files: z.array(RegistryItemFileSchema).optional(),
});

export const RegistryRepoMetadataSchema = z.object({
  repoId: z.number(),
  owner: z.string(),
  url: z.string(),
  name: z.string(),
  stars: z.number().optional(),
  forks: z.number().optional(),
  issues: z.number().optional(),
  watchers: z.number().optional(),
  openIssues: z.number().optional(),
  archived: z.boolean().optional(),

  repoCreatedAt: z.date(),
  repoUpdatedAt: z.date(),
  repoPushedAt: z.date().optional(),

  license: z.string().optional(),
});

export const RegistryItemCommitSchema = z.object({
  commitSha: z.string(),
  message: z.string(),
  url: z.string(),
  date: z.date(),
});

export type RegistryRepoMetadata = z.infer<typeof RegistryRepoMetadataSchema>;
export type Registry = z.infer<typeof RegistrySchema>;
export type RegistryItemType = z.infer<typeof RegistryItemTypeEnum>;
export type RegistryItemFile = z.infer<typeof RegistryItemFileSchema>;
export type RegistryItem = z.infer<typeof RegistryItemSchema>;
export type RegistryItemCommit = z.infer<typeof RegistryItemCommitSchema>;
