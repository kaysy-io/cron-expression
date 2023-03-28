import { Expression } from '@app/expressions/expression';
import { InvalidCronExpression } from '@app/exceptions/invalid-cron-expression';
import { MinuteExpression } from './expressions/minute';
import { HourExpression } from './expressions/hour';
import { DayOfMonthExpression } from './expressions/day-of-month';
import { MonthExpression } from './expressions/month';
import { DayOfWeekExpression } from './expressions/day-of-week';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

export class Cron {
    /**
     * The timezone in which this cron operates. By default, it is assumed to be UTC.
     *
     * @var
     */
    protected _timezone: string;

    /**
     * Minutes expression from 0 to 59
     *
     * @var
     */
    protected _minute: Expression;

    /**
     * Hour expression from 0 to 23
     *
     * @var
     */
    protected _hour: Expression;

    /**
     * Day of month expression from 1 to 31
     *
     * @var
     */
    protected _dayOfMonth: Expression;

    /**
     * Month expression from 1 to 12 or jan to dec
     *
     * @var
     */
    protected _month: Expression;

    /**
     * Day of week expression from 0 to 7. 0 and 7 means Sunday
     *
     * @var
     */
    protected _dayOfWeek: Expression;

    private constructor(segments: string[], timezone: string) {
        this._timezone = timezone;

        this._minute = this.minuteExpression(segments[0]);
        this._hour = this.hourExpression(segments[1]);
        this._dayOfMonth = this.dayOfMonthExpression(segments[2]);
        this._month = this.monthExpression(segments[3]);
        this._dayOfWeek = this.dayOfWeekExpression(segments[4]);
    }

    /**
     * Creates a new cron object that run every minute or all the time.
     *
     * @param timezone
     * @returns
     */
    public static always(timezone: string = 'UTC'): Cron {
        return Cron.from('* * * * *', timezone);
    }

    /**
     * Creates a new Cron object for the given expression
     *
     * @param expression
     * @param timezone
     * @returns
     */
    public static from(expression: string, timezone: string = 'UTC'): Cron {
        expression = expression.trim();

        const segments = expression.split(' ');

        if (segments.length !== 5) {
            throw new InvalidCronExpression(expression);
        }
        return new Cron(segments, timezone);
    }

    /**
     * Returns the minute expression object
     *
     * @param expression
     * @returns
     */
    public minuteExpression(expression: string) {
        return MinuteExpression.from(expression);
    }

    /**
     * Returns the hour expression object
     *
     * @param expression
     * @returns
     */
    public hourExpression(expression: string) {
        return HourExpression.from(expression);
    }

    /**
     * Returns the day of month expression object
     *
     * @param expression
     * @returns
     */
    public dayOfMonthExpression(expression: string) {
        return DayOfMonthExpression.from(expression);
    }

    /**
     * Returns the month expression object
     *
     * @param expression
     * @returns
     */
    public monthExpression(expression: string) {
        return MonthExpression.from(expression);
    }

    /**
     * Returns the day of week expression object
     *
     * @param expression
     * @returns
     */
    public dayOfWeekExpression(expression: string) {
        return DayOfWeekExpression.from(expression);
    }

    /**
     * Sets a new minute expression
     *
     * @param expression
     * @returns
     */
    public minute(expression: string) {
        this._minute = this.minuteExpression(expression);

        return this;
    }

    /**
     * Sets a new hour expression
     *
     * @param expression
     * @returns
     */
    public hour(expression: string) {
        this._hour = this.hourExpression(expression);

        return this;
    }

    /**
     * Sets a new day of month expression
     *
     * @param expression
     * @returns
     */
    public dayOfMonth(expression: string) {
        this._dayOfMonth = this.dayOfMonthExpression(expression);

        return this;
    }

    /**
     * Sets a new month expression
     *
     * @param expression
     * @returns
     */
    public month(expression: string) {
        this._month = this.monthExpression(expression);

        return this;
    }

    /**
     * Sets a new day of week expression
     *
     * @param expression
     * @returns
     */
    public dayOfWeek(expression: string) {
        this._dayOfWeek = this.dayOfWeekExpression(expression);

        return this;
    }

    /**
     * Sets the timezone on which this cron operates
     *
     * @param timezone
     * @returns
     */
    public timezone(timezone: string) {
        this._timezone = timezone;

        return this;
    }

    /**
     * Returns true if this cron matches the current date and time
     *
     * @returns
     */
    public isValid(): boolean {
        const now = dayjs().tz(this._timezone, true);

        return (
            this._minute.matches(now.minute()) &&
            this._hour.matches(now.hour()) &&
            this._dayOfMonth.matches(now.date()) &&
            this._month.matches(now.month() + 1) &&
            this._dayOfWeek.matches(now.day())
        );
    }
}
