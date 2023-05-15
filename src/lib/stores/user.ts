import type { User } from "@prisma/client";
import { writable } from "svelte/store";

export const user = writable<User>();
