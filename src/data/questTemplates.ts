// src/data/questTemplates.ts

import type { Quest } from "../types/gamification";

export const weeklyQuests: Quest[] = [
    {
        id: "use-skills-3x",
        title: "3 Skills anwenden",
        description: "Wende diese Woche 3 verschiedene Skills an.",
        goal: 3,
        progress: 0,
        rewardXP: 50,
        completed: false,
        period: "weekly",
    },
    {
        id: "mood-tracker-2x",
        title: "2x Mood getrackt",
        description: "Nutze den Mood-Kompass mindestens 2x diese Woche.",
        goal: 2,
        progress: 0,
        rewardXP: 40,
        completed: false,
        period: "weekly",
    },
];
