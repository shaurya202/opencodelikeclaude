import { join } from "path";
export function expandHome(path) {
    if (path.startsWith("~/")) {
        const home = process.env.HOME || process.env.USERPROFILE;
        if (!home) {
            return path.slice(2);
        }
        return join(home, path.slice(2));
    }
    return path;
}
//# sourceMappingURL=path.js.map