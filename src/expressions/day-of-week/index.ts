import { Expression } from '@app/expressions/expression';

const DAY_OF_WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export class DayOfWeekExpression extends Expression {
    /**
     * Returns a minute expression object of the given string
     *
     * @param expression
     * @returns
     */
    public static from(expression: string): DayOfWeekExpression {
        return new DayOfWeekExpression(expression);
    }

    /**
     * Returns the integer corresponding to the given value
     *
     * @param value
     * @returns
     */
    protected toInteger(value: string) {
        value = value.toLowerCase();

        const stringPosition = DAY_OF_WEEKS.indexOf(value);

        if (stringPosition !== -1) {
            return stringPosition;
        }
        return parseInt(value);
    }

    /**
     * Returns true if the given value matches the accepted values of this cron expression.
     * For sunday, the parameter value will be 0, but it is not necessary cron expression
     * has a zero. 7 is also Sunday, so we have to consider that as well.
     *
     * @param value
     * @returns
     */
    public matches(value: number): boolean {
        return super.matches(value) || (value === 0 && this.values().includes(7));
    }

    /**
     * Returns the expression segment name
     *
     * @returns
     */
    protected segment(): string {
        return 'day of week';
    }

    /**
     * Returns the start value of this expression. For example, day of week expression
     * ranges from 0-7. So start value in this case will be 0. 0 and 7 means Sunday
     *
     * @returns
     */
    protected startValue(): number {
        return 0;
    }

    /**
     * Returns the end value of this expression. For example, day of week expression
     * ranges from 0-7. So end value in this case will be 7. 0 and 7 means Sunday.
     *
     * @returns
     */
    protected endValue(): number {
        return 7;
    }
}
