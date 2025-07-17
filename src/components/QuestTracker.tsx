// src/components/QuestTracker.tsx
import { useQuests } from "../hooks/useQuest";
import { useTranslation } from "react-i18next";

export const QuestTracker = () => {
    const { quests } = useQuests();
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">
                🎯 {t("quests.weeklyTitle")}
            </h2>
            <ul>
                {quests.map((quest) => (
                    <li key={quest.id} className="mb-2">
                        <strong>{t(`quests.${quest.id}.title`)}</strong> <br />
                        {t(`quests.${quest.id}.description`)} <br />
                        {t("quests.progress")}: {quest.progress}/{quest.goal}
                        {quest.completed && <span> ✅</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
