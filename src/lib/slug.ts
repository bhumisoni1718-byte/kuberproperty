import slugifyLib from "slugify";
import { nanoid } from "nanoid";

export function createSlug(text: string, unique = false) {
  const base = slugifyLib(text, { lower: true, strict: true, trim: true });
  return unique ? `${base}-${nanoid(6)}` : base;
}
