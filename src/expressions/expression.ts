import { InvalidCronExpression } from '@app/exceptions/invalid-cron-expression';

export abstract class Expression {
    /**
     * The cron expression of the segment
     *
     * @var
     */
    protected expression: string;

    /**
     * The valid values of this expression
     *
     * @var
     */
    protected _values: number[];

    protected constructor(expression: string) {
        this.expression = expression.trim();

        this._values = this.parseExpression();
    }

    /**
     * Returns the expression segment name
     *
     * @returns
     */
    protected abstract segment(): string;

    /**
     * Returns the start value of this expression. For example, minutes expression
     * ranges from 0-59. So start value in this case will be 0.
     *
     * @returns
     */
    protected abstract startValue(): number;

    /**
     * Returns the end value of this expression. For example, months expression
     * ranges from 1-31. So end value in this case will be 31.
     *
     * @returns
     */
    protected abstract endValue(): number;

    /**
     * Returns range of values from start to end. If step is provided, stepped values
     * are returned from start to end.
     *
     * @param start
     * @param end
     * @param steps
     * @returns
     */
    protected range(start: number, end: number, steps: number): number[] {
        if (start < this.startValue() || end > this.endValue() || start > end) {
            throw new InvalidCronExpression(this.expression, this.segment());
        }

        return new Array(end - start + 1)
            .fill(start)
            .map((value, index) => start + index * steps)
            .filter((value) => value <= end);
    }

    /**
     * Returns the valid values of this expression.
     *
     * @returns
     */
    public values(): number[] {
        return this._values;
    }

    /**
     * Parses the expression string and returns the values corresponding to it
     *
     * @returns
     */
    protected parseExpression(): number[] {
        let values: number[] = [];

        const repetitions = this.repetitions();

        for (let rep of repetitions) {
            let [value, steps] = this.getValueAndSteps(rep);
            let [start, end] = this.getValueRange(value);

            if (steps != null) {
                end = end ?? this.endValue().toString();
            } else {
                steps = '1';
                end = end ?? start;
            }
            const validValues = this.range(this.toInteger(start), this.toInteger(end), this.toInteger(steps));

            values = values.concat(validValues);
        }
        return Array.from(new Set(values));
    }

    /**
     * Returns the integer corresponding to the given value
     *
     * @param value
     * @returns
     */
    protected toInteger(value: string) {
        return parseInt(value);
    }

    /**
     * Returns the value range of an expression. For example, if the expression is `25` we
     * return an array containing just 25. If it's a range, we return it as it is.
     *
     * @param expression
     * @returns
     */
    protected getValueRange(expression: string): string[] {
        expression = expression.trim();

        if (expression === '*') {
            return [this.startValue().toString(), this.endValue().toString()];
        }
        const valueRange: string[] = expression.split('-');

        // The expression should contain at least one range element that denotes start
        // and at most two elements that denote start and end.
        if (valueRange.length === 0 || valueRange.length > 2) {
            throw new InvalidCronExpression(this.expression, this.segment());
        }

        // If the first element is a *, we'll abort the expression parse saying, invalid
        // format as cron expression cannot be of the form `*-10`
        if (valueRange[0] === '*') {
            throw new InvalidCronExpression(this.expression, this.segment());
        }

        return valueRange;
    }

    /**
     * Returns the value and steps of an expression. For example, if the expression
     * is `0-59/10`, this function returns an array with values `['0-59', '10']`.
     *
     * @param expression
     * @returns
     */
    protected getValueAndSteps(expression: string) {
        // If the expression starts with a step identifier, it is considered invalid.
        // The expression should have a value part.
        if (expression.startsWith('/')) {
            throw new InvalidCronExpression(this.expression, this.segment());
        }
        const valueAndSteps: string[] = expression.split('/');

        // The expression should contain at least one value section and at most one step
        // segment. So the min size is 1 and max is 2.
        if (valueAndSteps.length === 0 || valueAndSteps.length > 2) {
            throw new InvalidCronExpression(this.expression, this.segment());
        }

        if (valueAndSteps.length === 2) {
            // If the step element is a *, we'll abort the expression parse saying, invalid
            // format as cron expression cannot be of the form `10/*`
            if (valueAndSteps[1] === '*' || valueAndSteps[1] === '' || valueAndSteps[1] === '0') {
                throw new InvalidCronExpression(this.expression, this.segment());
            }
        }
        return valueAndSteps;
    }

    /**
     * Split the expression by comma to get the list of expressions. A cron expression can be
     * of the form `1/2,10-15/15,15/15 * * * *` where the string `1/2,10-15/15,15/15` corresponds
     * to minute value repetitions
     *
     * @returns
     */
    protected repetitions(): string[] {
        return this.expression.split(',');
    }

    /**
     * Returns true if the given value matches the accepted values of this cron expression
     *
     * @param value
     * @returns
     */
    public matches(value: number): boolean {
        return this.values().includes(value);
    }
}
