import type { ScheduleRule, ScheduleType } from '../services/itemsApi';

interface ScheduleBuilderProps {
  value: ScheduleRule;
  onChange: (schedule: ScheduleRule) => void;
}

const days = [
  ['S', 0],
  ['M', 1],
  ['T', 2],
  ['W', 3],
  ['T', 4],
  ['F', 5],
  ['S', 6],
] as const;

const scheduleTypes: ScheduleType[] = ['once', 'daily', 'weekly', 'monthly', 'custom'];

const ScheduleBuilder = ({ value, onChange }: ScheduleBuilderProps) => {
  const update = (patch: Partial<ScheduleRule>) => onChange({ ...value, ...patch });

  const toggleDay = (day: number) => {
    const current = value.daysOfWeek ?? [];
    const next = current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort();
    update({ daysOfWeek: next });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-kibana-text">Schedule</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {scheduleTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update({ type })}
              className={`rounded-md border px-3 py-2 text-sm capitalize transition-colors ${
                value.type === type
                  ? 'border-kibana-accent bg-kibana-accent text-white'
                  : 'border-kibana-border bg-kibana-bg text-kibana-text hover:border-kibana-accent'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-kibana-text">
          Time
          <input
            type="time"
            value={value.time ?? '09:00'}
            onChange={(event) => update({ time: event.target.value })}
            className="w-full rounded-md border border-kibana-border bg-kibana-bg px-3 py-2 text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-kibana-text">
          Timezone
          <input
            value={value.timezone}
            onChange={(event) => update({ timezone: event.target.value })}
            className="w-full rounded-md border border-kibana-border bg-kibana-bg px-3 py-2 text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
          />
        </label>
      </div>

      {(value.type === 'weekly' || value.type === 'custom') && (
        <div>
          <label className="mb-2 block text-sm font-medium text-kibana-text">Days</label>
          <div className="grid grid-cols-7 gap-2">
            {days.map(([label, day], index) => (
              <button
                key={`${label}-${index}`}
                type="button"
                onClick={() => toggleDay(day)}
                className={`aspect-square rounded-md border text-sm font-medium ${
                  value.daysOfWeek?.includes(day)
                    ? 'border-kibana-success bg-kibana-success text-black'
                    : 'border-kibana-border bg-kibana-bg text-kibana-text hover:border-kibana-success'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {(value.type === 'monthly' || value.type === 'custom') && (
        <label className="space-y-2 text-sm font-medium text-kibana-text">
          Day of month
          <input
            type="number"
            min={1}
            max={31}
            value={value.dayOfMonth?.[0] ?? 1}
            onChange={(event) => update({ dayOfMonth: [Number(event.target.value)] })}
            className="w-full rounded-md border border-kibana-border bg-kibana-bg px-3 py-2 text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
          />
        </label>
      )}

      {value.type === 'custom' && (
        <label className="space-y-2 text-sm font-medium text-kibana-text">
          Interval
          <input
            type="number"
            min={1}
            value={value.interval ?? 1}
            onChange={(event) => update({ interval: Number(event.target.value) })}
            className="w-full rounded-md border border-kibana-border bg-kibana-bg px-3 py-2 text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
          />
        </label>
      )}

      <label className="space-y-2 text-sm font-medium text-kibana-text">
        End date
        <input
          type="date"
          value={value.endDate ? value.endDate.slice(0, 10) : ''}
          onChange={(event) => update({ endDate: event.target.value ? new Date(event.target.value).toISOString() : undefined })}
          className="w-full rounded-md border border-kibana-border bg-kibana-bg px-3 py-2 text-kibana-text outline-none focus:ring-2 focus:ring-kibana-accent"
        />
      </label>
    </div>
  );
};

export default ScheduleBuilder;
