// Emoji list with labels for mood tracking

export type Emoji = {
  emoji: string;
  label: string;
};

export const emojiList: Emoji[] = [
  { emoji: "😃", label: "Glücklich" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😢", label: "Traurig" },
  { emoji: "😡", label: "Wütend" },
  { emoji: "😱", label: "Ängstlich" },
  { emoji: "🤩", label: "Aufgeregt" },
  { emoji: "🥱", label: "Müde" },
  { emoji: "😞", label: "Enttäuscht" },
];

export default emojiList;
