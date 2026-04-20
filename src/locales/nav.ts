import type { Lang } from "../config/i18n";

export type NavMessages = {
  about: string;
  composer: string;
  learning: string;
  documentation: string;
  benchmark: string;
  community: string;
  code: string;
  courses?: string;
  docs: string;
  api: string;
  // Community submenus
  communityGroups: {
    contribution: string;
    competitions: string;
    resources: string;
  };
  communityItems: {
    contributionGuide: string;
    developerGrowth: string;
    internship: string;
    hackathon: string;
    koushareStream: string;
    bilibiliStream: string;
    paperLecture: string;
  };
  learningItems: {
    courses: string;
    videoCourses: string;
    whitePaper: string;
    paperCode: string;
  };
};

export const NAV_MESSAGES: Record<Lang, NavMessages> = {
  en: {
    about: "About",
    composer: "Composer",
    learning: "Learning",
    documentation: "Documentation",
    benchmark: "Benchmark",
    community: "Community",
    code: "Code",
    docs: "Docs",
    api: "API",
    communityGroups: {
      contribution: "Contribution and Growth",
      competitions: "Competition Activities",
      resources: "Resources",
    },
    communityItems: {
      contributionGuide: "Contribution Guide",
      developerGrowth: "Developer Growth and Certification",
      internship: "Internship",
      hackathon: "Hackathon Competition",
      koushareStream: "Group Meeting Live Stream-Koushare",
      bilibiliStream: "Group Meeting Live Stream-BiliBili",
      paperLecture: "Paper Intensive Lecture",
    },
    learningItems: {
      courses: "Courses",
      videoCourses: "Video Courses",
      whitePaper: "White Paper",
      paperCode: "Paper Code",
    },
  },
  zh: {
    about: "关于",
    composer: "编辑器",
    learning: "学习",
    documentation: "文档",
    benchmark: "性能",
    community: "社区",
    code: "代码",
    courses: "课程",
    docs: "文档",
    api: "API",
    communityGroups: {
      contribution: "贡献与成长",
      competitions: "竞赛活动",
      resources: "资源",
    },
    communityItems: {
      contributionGuide: "贡献指南",
      developerGrowth: "开发者成长与认证",
      internship: "实习",
      hackathon: "黑客松比赛",
      koushareStream: "组会直播-蔻享",
      bilibiliStream: "组会直播-哔哩哔哩",
      paperLecture: "论文精讲",
    },
    learningItems: {
      courses: "课程",
      videoCourses: "视频课程",
      whitePaper: "白皮书",
      paperCode: "论文代码",
    },
  },
};
