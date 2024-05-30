export enum Country {
    CHINA,
    JAPAN,
    AMERICA
}

export interface Progress {
    season: number;
    episode: number;
    time: number;
}

export enum Platform {
    LOCAL,
    BILIBILI,
    AGE,
    BAIDU_NET_DISK,
}

export interface BangumiSource {
    platform: Platform;
    src: string;
}

export enum BangumiStatus {
    UPDATING,
    FINISHED
}

export interface UpdateProgress {
    current: number;
    total: number;
}

export interface BangumiEntity {
    name: string;
    author: string;
    publishTime: number;
    status: BangumiStatus;
    updateProgress: UpdateProgress;
    readCount: number;
    stars: number;
    country: Country;
    lastProgress: Progress;
    sources: BangumiSource[];
    avatar?: string;
    note?: string;
}