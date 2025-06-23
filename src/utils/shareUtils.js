/**
 * Utility functions for sharing content
 */

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
      console.log('Achievement shared successfully');
    })
    .catch((error) => {
      console.error('Error sharing achievement:', error);
      alert("Fehler beim Teilen.");
    });
  } else {
    alert("Teilen nicht unterstützt.");
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
      console.log('Skill shared successfully');
    })
    .catch((error) => {
      console.error('Error sharing skill:', error);
      alert("Fehler beim Teilen.");
    });
  } else {
    alert("Teilen nicht unterstützt.");
  }
}

export default {
  shareAchievement,
  shareSkill
};
