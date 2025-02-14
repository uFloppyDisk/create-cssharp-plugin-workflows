import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const ROOT = path.join(path.dirname(__filename), "../");

export const TARGET_BASE = IS_PRODUCTION ? process.cwd() : path.join(ROOT, '.playground');

export const TEMPLATE_BASE = path.join(ROOT, 'templates');

