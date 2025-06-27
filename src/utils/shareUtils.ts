/**
 * Utility functions for sharing content
 */
import { showErrorToast, showInfoToast, showSuccessToast } from "./toastUtils";

export interface Achievement {
  text: string;
  date: string;
}

/**
 * Share an achievement/success
 * @param achievement - The achievement to share
 */
export function shareAchievement(achievement: Achievement): void {
  if (navigator.share) {
    navigator
      .share({
        title: "Erfolg",
        text: `${achievement.text} (${achievement.date})`,
        url: window.location.href,
      })
      .then(() => {
        showSuccessToast("Erfolg erfolgreich geteilt! 🎉");
      })
      .catch((error: Error) => {
        console.error("Error sharing achievement:", error);
        if (error.name === "AbortError") {
          // User cancelled sharing - don't show error
          console.log("Sharing cancelled by user");
          showInfoToast("Teilen abgebrochen");
        } else {
          showErrorToast("Fehler beim Teilen des Erfolgs");
        }
      });
  } else {
    showErrorToast("Teilen wird von diesem Browser nicht unterstützt");
  }
}

/**
 * Share a skill
 * @param skill - The skill to share
 */
export function shareSkill(skill: string): void {
  if (navigator.share) {
    navigator
      .share({
        title: "Skill",
        text: skill,
        url: window.location.href,
      })
      .then(() => {
        showSuccessToast("Skill erfolgreich geteilt! ✨");
      })
      .catch((error: Error) => {
        console.error("Error sharing skill:", error);
        if (error.name === "AbortError") {
          // User cancelled sharing
          showInfoToast("Teilen abgebrochen");
        } else {
          showErrorToast("Fehler beim Teilen des Skills");
        }
      });
  } else {
    showErrorToast("Teilen wird von diesem Browser nicht unterstützt");
  }
}

export default {
  shareAchievement,
  shareSkill,
};
