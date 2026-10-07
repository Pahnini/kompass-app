import { GamificationProvider } from '../context/GamificationContext';
import ArcadePage from './ArcadePage';
export default function ArcadeDemoPage() {
  return (
    <GamificationProvider demo>
      <ArcadePage />
    </GamificationProvider>
  );
}
