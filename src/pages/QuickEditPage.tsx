import React from 'react';
import type { SidebarItem } from '../types/index';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/ui/BackButton';

interface QuickEditProps {
  quickItems: string[];
  setQuickItems: (items: string[]) => void;
  allItems: SidebarItem[];
}

export default function QuickEdit({
  quickItems,
  setQuickItems,
  allItems,
}: QuickEditProps): React.ReactElement {
  const { t } = useTranslation();

  function toggleQuick(key: string): void {
    setQuickItems(
      quickItems.includes(key) ? quickItems.filter(f => f !== key) : [...quickItems, key]
    );
  }

  return (
    <div className="card">
      <BackButton />
      <div className="section">
        <h2>{t('quickEdit.title')}</h2>
        <p style={{ color: '#d0d0d0', marginBottom: '20px' }}>{t('quickEdit.description')}</p>

        <ul>
          {allItems
            .filter(i => i.key !== 'home' && i.key !== 'quickedit')
            .map(item => (
              <li key={item.key}>
                <input
                  type="checkbox"
                  checked={quickItems.includes(item.key)}
                  onChange={() => toggleQuick(item.key)}
                />
                <span className="text-content">
                  <span style={{ marginRight: '8px', fontSize: '18px' }}>
                    {item.icon as React.ReactNode}
                  </span>
                  {t(item.label)}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
