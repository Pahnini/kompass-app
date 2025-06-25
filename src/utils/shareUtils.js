/**
 * Utility functions for sharing content
 */

/**
 * Share content using the Web Share API if available
 * @param {Object} shareData - The data to share
 * @param {string} shareData.title - The title of the shared content
 * @param {string} shareData.text - The text content to share
 * @param {string} shareData.url - The URL to share (defaults to current URL)
 * @returns {Promise<void>} - A promise that resolves when sharing is complete
 */
export const shareContent = async (shareData) => {
  // Default to current URL if not provided
  const dataToShare = {
    ...shareData,
    url: shareData.url || window.location.href
  };

  // Check if Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share(dataToShare);
      return true;
    } catch (error) {
      // User cancelled or sharing failed
      console.error("Sharing failed:", error);
      return false;
    }
  } else {
    // Web Share API not available
    alert("Teilen nicht unterstützt.");
    return false;
  }
};

/**
 * Share an achievement/success
 * @param {Object} achievement - The achievement to share
 * @param {string} achievement.text - The achievement text
 * @param {string} achievement.date - The achievement date
 */
export const shareAchievement = (achievement) => {
  return shareContent({
    title: "Erfolg",
    text: `${achievement.text} (${achievement.date})`
  });
};

/**
 * Share a skill
 * @param {string} skill - The skill to share
 */
export const shareSkill = (skill) => {
  return shareContent({
    title: "Skill",
    text: skill
  });
};

export default {
  shareContent,
  shareAchievement,
  shareSkill
};
