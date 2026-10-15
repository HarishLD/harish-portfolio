import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The public resume, only if the phone-free PDF has been added to
 * public/resume.pdf. Checked at build time (pages are static), so the
 * download buttons appear automatically once the file is committed.
 */
export const RESUME_PATH = "/resume.pdf";

export function getResumeHref(): string | undefined {
  return existsSync(join(process.cwd(), "public", "resume.pdf")) ? RESUME_PATH : undefined;
}
