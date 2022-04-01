export enum PageStatus {
    Idle,
    Pending,
    Done,
    Error
}

export enum InputMode {
    Manual,
    Automatic,
    None
}

export type ErrorMessage = {
    error: string;
};

export interface TabProps{
    name: string,
    label: string,
}
