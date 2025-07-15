// Help resources and emergency contact websites
export type HelpResource = {
  name: string;
  nameKey: string;
  url: string;
};
export const helpResources: HelpResource[] = [
  { name: 'Nummer gegen Kummer', nameKey: 'emergency.resources.nummerGegenKummer', url: 'https://www.nummergegenkummer.de/' },
  {
    name: 'KJP Harburg (Asklepios)',
    nameKey: 'emergency.resources.kjpHarburg',
    url: 'https://www.asklepios.com/harburg/abteilungen-spezialistinnen/abteilungen/kjpp',
  },
  { name: 'JugendNotmail', nameKey: 'emergency.resources.jugendNotmail', url: 'https://jugendnotmail.de/' },
  { name: 'krisenchat.de', nameKey: 'emergency.resources.krisenchat', url: 'https://krisenchat.de/' },
];

export default helpResources;
