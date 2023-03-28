import { Expression } from '@app/expressions/expression';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export class MonthExpression extends Expression {
    /**
     * Returns a minute expression object of the given string
     *
     * @param expression
     * @returns
     */
    public static from(expression: string): MonthExpression {
        return new MonthExpression(expression);
    }

    /**
     * Returns the integer corresponding to the given value
     *
     * @param value
     * @returns
     */
    protected toInteger(value: string) {
        value = value.toLowerCase();

        const stringPosition = MONTHS.indexOf(value);

        // Month values are from 1-12, so we've to add 1 to the index of the position
        // of the string to get the correct integer value.
        if (stringPosition !== -1) {
            return stringPosition + 1;
        }
        return parseInt(value);
    }

    /**
     * Returns the expression segment name
     *
     * @returns
     */
    protected segment(): string {
        return 'month';
    }

    /**
     * Returns the start value of this expression. For example, month expression
     * ranges from 1-12. So start value in this case will be 0.
     *
     * @returns
     */
    protected startValue(): number {
        return 1;
    }

    /**
     * Returns the end value of this expression. For example, month expression
     * ranges from 1-12. So end value in this case will be 12.
     *
     * @returns
     */
    protected endValue(): number {
        return 12;
    }
}
