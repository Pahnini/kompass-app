import { useUser } from '@supabase/auth-helpers-react';
import { useCallback, useEffect, useState } from 'react';
import NewPlanForm from '../../components/SchoolSupport/NewPlanForm';
import { useTranslation } from 'react-i18next'; // ✅
import { supabase } from '../../utils/supabase';

type SchoolPlan = {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  status: 'open' | 'in_progress' | 'done';
};

export default function SchoolPlanTab() {
  const { t } = useTranslation();
  const user = useUser();
  const [plans, setPlans] = useState<SchoolPlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('school_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) {
      setError(t('schoolSupport.errorLoadingPlans'));
      console.error(error);
    } else {
      setPlans(data as SchoolPlan[]);
      setError(null);
    }
  }, [user]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const markAsDone = async (id: string) => {
    const { error } = await supabase
      .from('school_plans')
      .update({ status: 'done' })
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) {
      console.error(t('schoolSupport.errorUpdating'), error);
    } else {
      fetchPlans();
    }
  };

  if (error) return <p style={{ color: 'white' }}>{error}</p>;

  return (
    <div>
      <h2>{t('schoolSupport.myLearningPlans')}</h2>

      <NewPlanForm onCreated={fetchPlans} />

      {plans.length === 0 ? (
        <p style={{ color: 'white' }}>{t('schoolSupport.noPlans')}</p>
      ) : (
        <ul className="space-y-4 mt-4">
          {plans.map(plan => (
            <li
              key={plan.id}
              className="p-4 border rounded-xl bg-white shadow-md dark:bg-slate-800 dark:border-slate-700"
            >
              <h3 className="text-lg font-semibold text-[#2f4f4f] dark:text-white">{plan.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{plan.description}</p>
              {plan.due_date && (
                <p className="text-xs text-gray-500 mt-1">
                  {t('schoolSupport.dueOn')} {new Date(plan.due_date).toLocaleDateString()}
                </p>
              )}
              <p className="mt-1 text-sm">
                {t('schoolSupport.status')} <strong className="capitalize">{plan.status}</strong>
              </p>

              {plan.status !== 'done' && (
                <button
                  onClick={() => markAsDone(plan.id)}
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
