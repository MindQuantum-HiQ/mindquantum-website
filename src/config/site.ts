// Central place for site-wide links and constants
export const REPO_URL = "https://atomgit.com/mindspore/mindquantum";
export const GITHUB_URL = "https://github.com/mindspore-ai/mindquantum";
export const GITEE_URL = "https://gitee.com/mindspore/mindquantum";
export const MINDSPORE_URL = "https://www.mindspore.cn/";
export const EVANGELISTS_URL = "https://www.mindspore.cn/developers";

export const KOUSHARE_URL = "https://www.koushare.com/";
export const BILIBILI_URL = "https://www.bilibili.com/";

export type CodeMirrorId = "atomgit" | "github" | "gitee";
export type CodeMirror = { id: CodeMirrorId; label: string; href: string };

export const CODE_MIRRORS: CodeMirror[] = [
  { id: "atomgit", label: "AtomGit", href: REPO_URL },
  { id: "github", label: "GitHub", href: GITHUB_URL },
  { id: "gitee", label: "Gitee", href: GITEE_URL },
];
