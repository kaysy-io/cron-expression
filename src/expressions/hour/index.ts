import { Expression } from '@app/expressions/expression';

export class HourExpression extends Expression {
    /**
     * Returns a minute expression object of the given string
     *
     * @param expression
     * @returns
     */
    public static from(expression: string): HourExpression {
        return new HourExpression(expression);
    }

    /**
     * Returns the expression segment name
     *
     * @returns
     */
    protected segment(): string {
        return 'hour';
    }

    /**
     * Returns the start value of this expression. For example, hour expression
     * ranges from 0-23. So start value in this case will be 0.
     *
     * @returns
     */
    protected startValue(): number {
        return 0;
    }

    /**
     * Returns the end value of this expression. For example, hour expression
     * ranges from 0-23. So end value in this case will be 59.
     *
     * @returns
     */
    protected endValue(): number {
        return 23;
    }
}
