// src/types/gamification.ts

export type Quest = {
    id: string;
    title: string;
    description: string;
    goal: number;
    progress: number;
    rewardXP: number;
    completed: boolean;
    period: "weekly" | "monthly";
};
