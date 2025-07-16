import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import { useTranslation } from 'react-i18next'; // ✅

type TransitionGoal = {
  id: string;
  goal: string;
  status: 'open' | 'done';
  due_date: string | null;
  comment: string | null;
  responsible_person: string | null;
};

export default function TransitionTab() {
  const { t } = useTranslation();
  const user = useUser();
  const [goals, setGoals] = useState<TransitionGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('transitions_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (!error && data) setGoals(data as TransitionGoal[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const markAsDone = async (id: string) => {
    const { error } = await supabase
      .from('transitions_plans')
      .update({ status: 'done' })
      .eq('id', id)
      .eq('user_id', user?.id);

    if (!error) fetchGoals();
  };

  const doneCount = goals.filter(g => g.status === 'done').length;
  const totalCount = goals.length;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#2f4f4f] dark:text-white">
        {t('schoolSupport.transitionPlanning')}
      </h2>

      {totalCount > 0 && (
        <div className="mb-4 text-sm text-gray-800 dark:text-gray-200">
          {t('schoolSupport.progress')}{' '}
          <strong>
            {doneCount} {t('schoolSupport.of')} {totalCount}
          </strong>{' '}
          {t('schoolSupport.goalsCompleted')}
        </div>
      )}

      {loading ? (
        <p>{t('loading.loadingGoals')}</p>
      ) : goals.length === 0 ? (
        <p>{t('schoolSupport.noGoals')}</p>
      ) : (
        <ul className="space-y-4">
          {goals.map(goal => (
            <li
              key={goal.id}
              className="p-4 border rounded-xl bg-white shadow-md dark:bg-slate-800 dark:border-slate-700"
            >
              <h3 className="text-base font-semibold text-[#2f4f4f] dark:text-white">
                {goal.goal}
              </h3>

              {goal.due_date && (
                <p className="text-xs text-gray-500">
                  {t('schoolSupport.dueDate')} {new Date(goal.due_date).toLocaleDateString()}
                </p>
              )}
              {goal.comment && (
                <p className="text-sm mt-1 text-gray-600 italic dark:text-gray-300">
                  {t('schoolSupport.note')} {goal.comment}
                </p>
              )}
              {goal.responsible_person && (
                <p className="text-xs text-gray-400">
                  {t('schoolSupport.responsible')} {goal.responsible_person}
                </p>
              )}

              <p className="text-sm mt-2">
                {t('schoolSupport.status')} <strong>{goal.status}</strong>
              </p>

              {goal.status !== 'done' && (
                <button
                  onClick={() => markAsDone(goal.id)}
                  className="mt-3 inline-block bg-[#2f4f4f] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#0b9444] transition"
                >
                  {t('buttons.markAchieved')}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
