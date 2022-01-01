export enum PageStatus {
    Idle,
    Pending,
    Done,
    Error
}

export type ServerError = { error: string; };