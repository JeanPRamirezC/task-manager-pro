export const STATUS_VALUES = ['pending', 'in-progress', 'completed'] as const;
export type TaskStatus = (typeof STATUS_VALUES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'pending': 'Pending',
  'in-progress': 'In progress',
  'completed': 'Completed',
};

export function isValidStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && (STATUS_VALUES as readonly string[]).includes(value);
}
