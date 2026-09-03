import { Save, ShieldCheck, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
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

function loadPlan(): SafetyPlan {
  try {
    const value = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null'
    ) as Partial<SafetyPlan> | null;
    return value ? { ...emptyPlan, ...value } : emptyPlan;
  } catch {
    return emptyPlan;
  }
}

export default function SafetyPlanPage(): React.ReactElement {
  const [plan, setPlan] = useState<SafetyPlan>(loadPlan);
  const [status, setStatus] = useState('');

  const update = (field: keyof SafetyPlan, value: string): void => {
    setPlan(current => ({ ...current, [field]: value.slice(0, 500) }));
    setStatus('');
  };

  const save = (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    setStatus('Dein Plan wurde nur in diesem Browser gespeichert.');
  };

  const remove = (): void => {
    localStorage.removeItem(STORAGE_KEY);
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
