export enum PageStatus {
    Idle,
    Pending,
    Done,
    Error
}

export type ErrorMessage = {
    error: string;
};

export interface TabProps{
    name: string,
    label: string,
}
