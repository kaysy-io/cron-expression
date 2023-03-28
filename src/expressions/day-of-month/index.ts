import { Expression } from '@app/expressions/expression';

export class DayOfMonthExpression extends Expression {
    /**
     * Returns a minute expression object of the given string
     *
     * @param expression
     * @returns
     */
    public static from(expression: string): DayOfMonthExpression {
        return new DayOfMonthExpression(expression);
    }

    /**
     * Returns the expression segment name
     *
     * @returns
     */
    protected segment(): string {
        return 'day of month';
    }

    /**
     * Returns the start value of this expression. For example, day of month expression
     * ranges from 1-31. So start value in this case will be 1.
     *
     * @returns
     */
    protected startValue(): number {
        return 1;
    }

    /**
     * Returns the end value of this expression. For example, day of month expression
     * ranges from 1-31. So end value in this case will be 31.
     *
     * @returns
     */
    protected endValue(): number {
        return 31;
    }
}
