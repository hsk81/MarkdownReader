export class AssertException {
    private message:string;

    public constructor(message?:string) {
        this.message = message;
    }

    public toString() {
        return 'AssertException: ' + this.message;
    }
}

export function assert(expression:any, message?:string) {
    if (!expression) {
        throw new AssertException(message);
    }
    return expression;
}

export default assert;
