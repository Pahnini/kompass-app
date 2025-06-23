/**
 * Utility functions for sharing content
 */
import { showErrorToast, showInfoToast, showSuccessToast } from './toastUtils';

/**
 * Share an achievement/success
 * @param {Object} achievement - The achievement to share
 * @param {string} achievement.text - The achievement text
 * @param {string} achievement.date - The achievement date
 */
export function shareAchievement(achievement) {
  if (navigator.share) {
    navigator.share({
      title: "Erfolg",
      text: `${achievement.text} (${achievement.date})`,
      url: window.location.href,
    })
    .then(() => {
      showSuccessToast('Erfolg erfolgreich geteilt! 🎉');
    })
    .catch((error) => {
      console.error('Error sharing achievement:', error);
      if (error.name === 'AbortError') {
        // User cancelled sharing - don't show error
        console.log('Sharing cancelled by user');
        showInfoToast('Teilen abgebrochen');
      } else {
        showErrorToast('Fehler beim Teilen des Erfolgs');
      }
    });
  } else {
    showErrorToast('Teilen wird von diesem Browser nicht unterstützt');
  }
}

/**
 * Share a skill
 * @param {string} skill - The skill to share
 */
export function shareSkill(skill) {
  if (navigator.share) {
    navigator.share({
      title: "Skill",
      text: skill,
      url: window.location.href,
    })
    .then(() => {
      showSuccessToast('Skill erfolgreich geteilt! ✨');
    })
    .catch((error) => {
      console.error('Error sharing skill:', error);
      if (error.name === 'AbortError') {
        // User cancelled sharing
        showInfoToast('Teilen abgebrochen');
      } else {
        showErrorToast('Fehler beim Teilen des Skills');
      }
    });
  } else {
    showErrorToast('Teilen wird von diesem Browser nicht unterstützt');
  }
}

export default {
  shareAchievement,
  shareSkill
};
