export const SIGN_IN_MODE = ['backoffice', 'chat-portal'] as const;
export const SIGN_IN_MODE_WITH_ALL = [...SIGN_IN_MODE, 'all'] as const;
export type ISignInMode = (typeof SIGN_IN_MODE)[number];
export type ISignInModeWithAll = (typeof SIGN_IN_MODE_WITH_ALL)[number];
