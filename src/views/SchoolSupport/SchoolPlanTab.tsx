import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import NewPlanForm from '../../components/SchoolSupport/NewPlanForm';

type SchoolPlan = {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  status: 'open' | 'in_progress' | 'done';
};

export default function SchoolPlanTab() {
  const user = useUser();
  const [plans, setPlans] = useState<SchoolPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('school_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) {
      setError('Fehler beim Laden der Lernpläne');
      console.error(error);
    } else {
      setPlans(data as SchoolPlan[]);
      setError(null);
    }
    setLoading(false);
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
      console.error('Fehler beim Aktualisieren:', error);
    } else {
      fetchPlans();
    }
  };

  if (loading) return <p>Lade Lernpläne...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#2f4f4f] dark:text-white">📘 Meine Lernpläne</h2>

      <NewPlanForm onCreated={fetchPlans} />

      {plans.length === 0 ? (
        <p>Du hast noch keine Lernpläne.</p>
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
                  Fällig am: {new Date(plan.due_date).toLocaleDateString()}
                </p>
              )}
              <p className="mt-1 text-sm">
                Status: <strong className="capitalize">{plan.status}</strong>
              </p>

              {plan.status !== 'done' && (
                <button
                  onClick={() => markAsDone(plan.id)}
                  className="mt-3 inline-block bg-[#2f4f4f] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#0b9444] transition"
                >
                  Als erledigt markieren
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
