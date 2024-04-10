export type Token = {
    id: string;
    username: string;
    email: string;
    admin: boolean;
};

export interface ResponseError{
    error: string;
    details?: string[];
}