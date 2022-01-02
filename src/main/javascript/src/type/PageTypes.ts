export enum PageStatus {
    Idle,
    Pending,
    Done,
    Error
}

export type ServerError = { error: string; };

export interface TabProps{
    name: string,
    label: string,
}