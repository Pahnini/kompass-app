// Help resources and emergency contact websites
export type HelpResource = {
  name: string;
  url: string;
};
export const helpResources: HelpResource[] = [
  { name: 'Nummer gegen Kummer', url: 'https://www.nummergegenkummer.de/' },
  {
    name: 'KJP Harburg (Asklepios)',
    url: 'https://www.asklepios.com/harburg/abteilungen-spezialistinnen/abteilungen/kjpp',
  },
  { name: 'JugendNotmail', url: 'https://jugendnotmail.de/' },
  { name: 'krisenchat.de', url: 'https://krisenchat.de/' },
];

export default helpResources;
