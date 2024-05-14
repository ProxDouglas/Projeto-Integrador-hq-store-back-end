import ResponseStatus from '../response-status/response-status.interface';

export default class ResponseException extends Error implements ResponseStatus {
    message: string;
    statusCode: number;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
