import type { MutationOptions } from "@apollo/client";

export type MutateOptions<T = unknown, TVariables = unknown> = Omit<MutationOptions<T, TVariables>,
	"mutation">;
