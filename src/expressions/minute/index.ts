import { Expression } from '@app/expressions/expression';

export class MinuteExpression extends Expression {
    /**
     * Returns a minute expression object of the given string
     *
     * @param expression
     * @returns
     */
    public static from(expression: string): MinuteExpression {
        return new MinuteExpression(expression);
    }

    /**
     * Returns the expression segment name
     *
     * @returns
     */
    protected segment(): string {
        return 'minutes';
    }

    /**
     * Returns the start value of this expression. For example, minutes expression
     * ranges from 0-59. So start value in this case will be 0.
     *
     * @returns
     */
    protected startValue(): number {
        return 0;
    }

    /**
     * Returns the end value of this expression. For example, minutes expression
     * ranges from 0-59. So end value in this case will be 59.
     *
     * @returns
     */
    protected endValue(): number {
        return 59;
    }
}
