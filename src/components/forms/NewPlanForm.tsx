import React from 'react';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import { useTranslation } from 'react-i18next'; // ✅

type Props = {
  onCreated: () => void;
};

export default function NewPlanForm({ onCreated }: Props) {
  const { t } = useTranslation();
  const user = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from('school_plans').insert([
      {
        user_id: user.id,
        title,
        description,
        due_date: dueDate || null,
        status: 'open',
        created_by: user.id,
      },
    ]);

    if (error) {
      setError(t('errors.saveError'));
      console.error(error);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      onCreated();
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={e => void handleSubmit(e)}
      className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md mb-6"
    >
      <h3 className="text-lg font-semibold text-[#2f4f4f] dark:text-white">
        {t('schoolSupport.createPlan')}
      </h3>

      <input
        type="text"
        placeholder={t('forms.placeholders.title')}
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="w-full p-2 rounded border dark:bg-slate-700 dark:text-white"
      />

      <textarea
        placeholder={t('forms.placeholders.description')}
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full p-2 rounded border dark:bg-slate-700 dark:text-white"
      />

      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="w-full p-2 rounded border dark:bg-slate-700 dark:text-white"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#2f4f4f] text-white px-4 py-2 rounded-xl hover:bg-[#0b9444] transition-all"
      >
        {loading ? t('loading.saving') : t('buttons.save')}
      </button>
    </form>
  );
}
