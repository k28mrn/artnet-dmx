export const EventType = {
  Error: 'error',
} as const;
export type EventType = typeof EventType[keyof typeof EventType];

export const SendStatus = {
  noChange: 'noChange',
  success: 'success',
  error: 'error',
} as const;
export type SendStatus = typeof SendStatus[keyof typeof SendStatus];