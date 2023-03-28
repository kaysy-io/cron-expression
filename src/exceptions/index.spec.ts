import tap from 'tap';
import { InvalidCronExpression } from './invalid-cron-expression';

// Tests invalid cron expressions can be thrown with and without any segment.
tap.test('InvalidCronExpression tests', (test) => {
    test.throws(
        () => {
            throw new InvalidCronExpression('*****');
        },
        Error,
        'Can throw invalid cron expression without a segment',
    );

    test.throws(
        () => {
            throw new InvalidCronExpression('*****', 'minute');
        },
        Error,
        'Can throw invalid cron expression with a segment',
    );
    test.end();
});
