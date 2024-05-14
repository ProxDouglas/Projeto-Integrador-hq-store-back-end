import ResponseStatus from './response-status.interface';

export default class ResponseStatusDefault implements ResponseStatus {
    message: string;
    statusCode: number;

    constructor() {
        this.message = 'Success';
        this.statusCode = 200;
    }
}
