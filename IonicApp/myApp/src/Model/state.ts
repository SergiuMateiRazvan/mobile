import {Task} from "./task";

export interface State {
    tasks?: Task[],
    error?: null,
    isLoading?: boolean
}
