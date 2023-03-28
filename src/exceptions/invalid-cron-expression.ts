export class InvalidCronExpression extends Error {
    constructor(expression: string, segment?: string) {
        super(`Invalid cron expression ${expression}` + (segment != null ? ` for ${segment}` : ''));
    }
}
