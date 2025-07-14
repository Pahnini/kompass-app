import { useState } from 'react';
import SchoolPlanTab from './SchoolPlanTab';
import GuideTab from './GuideTab';
import TransitionTab from '../../components/SchoolSupport/TransitionTab';
import FilesTab from '../../components/SchoolSupport/FilesTab';

export default function SchoolSupportView() {
  const [activeTab, setActiveTab] = useState<'plans' | 'transition' | 'files' | 'chat' | 'guide'>(
    'plans'
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'plans':
        return <SchoolPlanTab />;
      case 'transition':
        return <TransitionTab />;
      case 'files':
        return <FilesTab />;
      case 'chat':
        return <div className="text-gray-500 dark:text-gray-300">Kommunikation folgt bald...</div>;
      case 'guide':
        return <GuideTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#2f4f4f] dark:text-white">🏫 Klinikschule</h1>

      <div className="tab-list">
        <TabButton
          label="Lernpläne"
          active={activeTab === 'plans'}
          onClick={() => setActiveTab('plans')}
        />
        <TabButton
          label="Übergangsplanung"
          active={activeTab === 'transition'}
          onClick={() => setActiveTab('transition')}
        />
        <TabButton
          label="Dateien"
          active={activeTab === 'files'}
          onClick={() => setActiveTab('files')}
        />
        <TabButton
          label="Kommunikation"
          active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
        />
        <TabButton
          label="Ratgeber"
          active={activeTab === 'guide'}
          onClick={() => setActiveTab('guide')}
        />
      </div>

      {renderTab()}
    </div>
  );
}

type TabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function TabButton({ label, active, onClick }: TabProps) {
  return (
    <button onClick={onClick} className={`tab-button ${active ? 'active' : ''}`}>
      {label}
    </button>
  );
}
