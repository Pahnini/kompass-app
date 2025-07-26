import { useState } from 'react';
import FilesTab from '../../components/SchoolSupport/FilesTab';
import TransitionTab from '../../components/SchoolSupport/TransitionTab';
import GuideTab from './GuideTab';
import SchoolPlanTab from './SchoolPlanTab';
import { t } from 'i18next';

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
        return <div style={{ color: 'white' }}>{t('schoolSupport.communicationComingSoon')}</div>;
      case 'guide':
        return <GuideTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#2f4f4f] dark:text-white">
        {t('schoolSupport.pageTitle')}
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        <TabButton
          label={t('schoolSupport.tabs.plans')}
          active={activeTab === 'plans'}
          onClick={() => setActiveTab('plans')}
        />
        <TabButton
          label={t('schoolSupport.tabs.transition')}
          active={activeTab === 'transition'}
          onClick={() => setActiveTab('transition')}
        />
        <TabButton
          label={t('schoolSupport.tabs.files')}
          active={activeTab === 'files'}
          onClick={() => setActiveTab('files')}
        />
        <TabButton
          label={t('schoolSupport.tabs.communication')}
          active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
        />
        <TabButton
          label={t('schoolSupport.tabs.guide')}
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
    <button
      onClick={onClick}
      style={{
        padding: '0.75rem 1rem',
        fontSize: '0.9rem',
        borderRadius: '12px',
        border: `2px solid ${active ? '#0b9444' : 'rgba(255, 255, 255, 0.2)'}`,
        background: active ? '#0b9444' : 'rgba(255, 255, 255, 0.1)',
        color: active ? '#fff' : '#fff',
        cursor: 'pointer',
        boxShadow: active ? '0 0 12px #0b9444' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500',
        margin: '0.25rem',
        flex: '1',
        minWidth: '100px',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = '#0b9444';
          e.currentTarget.style.border = '2px solid #0b9444';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)';
        }
      }}
    >
      {label}
    </button>
  );
}
