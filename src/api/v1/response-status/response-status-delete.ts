import ResponseStatus from './response-status.interface';

export default class ResponseStatusDelete implements ResponseStatus {
    message: string;
    statusCode: number;

    constructor() {
        this.message = 'Success';
        this.statusCode = 200;
    }
}
