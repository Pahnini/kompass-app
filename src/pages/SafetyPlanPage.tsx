import { Save, ShieldCheck, Trash2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useUserData } from '../hooks/useUserData';
import { accountStorageKey, useScopedStorage } from '../hooks/useScopedStorage';
import BackButton from '../components/ui/BackButton';
import './SafetyPlanPage.css';

type SafetyPlan = {
  warningSigns: string;
  calmingSteps: string;
  trustedPerson: string;
  safePlace: string;
};

const STORAGE_KEY = 'melforia_safety_plan_v1';
const emptyPlan: SafetyPlan = {
  warningSigns: '',
  calmingSteps: '',
  trustedPerson: '',
  safePlace: '',
};

function validatePlan(value: unknown): SafetyPlan {
  if (!value || typeof value !== 'object') return emptyPlan;
  return Object.fromEntries(
    Object.keys(emptyPlan).map(key => [
      key,
      typeof (value as Record<string, unknown>)[key] === 'string'
        ? String((value as Record<string, unknown>)[key]).slice(0, 500)
        : '',
    ])
  ) as SafetyPlan;
}

export default function SafetyPlanPage(): React.ReactElement {
  const { userId } = useUserData();
  const [stored, writePlan] = useScopedStorage(
    accountStorageKey(STORAGE_KEY, userId),
    emptyPlan,
    validatePlan
  );
  const [plan, setPlan] = useState<SafetyPlan>(stored);
  const [status, setStatus] = useState('');
  useEffect(() => {
    setPlan(stored);
    setStatus('');
  }, [stored]);

  const update = (field: keyof SafetyPlan, value: string): void => {
    setPlan(current => ({ ...current, [field]: value.slice(0, 500) }));
    setStatus('');
  };

  const save = (): void => {
    setStatus(
      writePlan(plan)
        ? 'Dein Plan wurde kontogetrennt in diesem Browser gespeichert.'
        : 'Der Browser konnte den Plan nicht speichern. Deine Eingabe bleibt erhalten.'
    );
  };

  const remove = (): void => {
    if (!writePlan(null)) {
      setStatus('Der Plan konnte nicht gelöscht werden.');
      return;
    }
    setPlan(emptyPlan);
    setStatus('Der lokale Sicherheitsplan wurde gelöscht.');
  };

  return (
    <div className="safety-plan-page">
      <BackButton />
      <header>
        <ShieldCheck aria-hidden="true" />
        <div>
          <p>Freiwillig und lokal</p>
          <h1>Mein persönlicher Sicherheitsplan</h1>
          <span>Notiere nur, was dir im schwierigen Moment schnell Orientierung geben kann.</span>
        </div>
      </header>

      <div className="safety-plan-alert">
        Dieser Plan ersetzt keine professionelle Hilfe. Bei unmittelbarer Gefahr:{' '}
        <a href="tel:112">112 anrufen</a> oder eine Person in deiner Nähe ansprechen.
      </div>

      <form
        onSubmit={event => {
          event.preventDefault();
          save();
        }}
      >
        <label>
          Woran merke ich, dass es mir schlechter geht?
          <textarea
            value={plan.warningSigns}
            onChange={event => update('warningSigns', event.currentTarget.value)}
            rows={3}
            maxLength={500}
          />
        </label>
        <label>
          Was hilft mir zuerst, etwas ruhiger zu werden?
          <textarea
            value={plan.calmingSteps}
            onChange={event => update('calmingSteps', event.currentTarget.value)}
            rows={3}
            maxLength={500}
          />
        </label>
        <label>
          Welche vertraute Person kann ich ansprechen?
          <textarea
            value={plan.trustedPerson}
            onChange={event => update('trustedPerson', event.currentTarget.value)}
            rows={2}
            maxLength={500}
            placeholder="Du kannst auch nur eine Rolle notieren, z. B. Schulsozialarbeit."
          />
        </label>
        <label>
          Wo kann ich hingehen, damit ich nicht allein bin?
          <textarea
            value={plan.safePlace}
            onChange={event => update('safePlace', event.currentTarget.value)}
            rows={2}
            maxLength={500}
          />
        </label>
        <p className="safety-plan-privacy">
          Die Angaben werden nicht an Nova übertragen und nicht mit anderen App-Bereichen verbunden.
        </p>
        {status && (
          <p role="status" className="safety-plan-status">
            {status}
          </p>
        )}
        <div className="safety-plan-actions">
          <button type="submit">
            <Save aria-hidden="true" /> Lokal speichern
          </button>
          <button type="button" className="is-delete" onClick={remove}>
            <Trash2 aria-hidden="true" /> Plan löschen
          </button>
        </div>
      </form>
    </div>
  );
}
