'use client';

import { STATUS_VALUES, STATUS_LABELS, isValidStatus, type TaskStatus } from '@/lib/constants';

type Props = {
  value: TaskStatus | '';
  onChange: (value: TaskStatus | '') => void;
};

export default function FiltersBar({ value, onChange }: Props) {
  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <label className="text-sm font-medium text-gray-700">Filter by status</label>
      <select
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '') return onChange('');
          onChange(isValidStatus(v) ? v : '');
        }}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All</option>
        {STATUS_VALUES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
