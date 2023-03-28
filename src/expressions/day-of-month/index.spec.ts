import tap from 'tap';
import { DayOfMonthExpression } from '.';

// Tests the validity of day of month expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones throw exceptions.
tap.test('Validity of day of month expressions', (test) => {
    test.doesNotThrow(() => DayOfMonthExpression.from('*'), '* is a valid day of month expression');
    test.doesNotThrow(() => DayOfMonthExpression.from('1'), '1 is a valid day of month expression');
    test.doesNotThrow(() => DayOfMonthExpression.from('31'), '31 is a valid day of month expression');
    test.doesNotThrow(() => DayOfMonthExpression.from('3,15'), '3,15 is a valid day of month expression');

    test.throws(() => DayOfMonthExpression.from('32'), Error, '32 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('0'), Error, '0 cannot be a valid day of month expression');
    test.doesNotThrow(() => DayOfMonthExpression.from('1/2'), '1/2 is a valid day of month expression');
    test.doesNotThrow(() => DayOfMonthExpression.from('31/2'), '31/2 is a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('32/5'), Error, '32/5 is a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('15-10'), Error, '15-10 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('15-10/2'), Error, '15-10/2 cannot be a valid day of month expression');

    test.throws(() => DayOfMonthExpression.from(''), Error, 'Empty string cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('*-20/2'), Error, '*-20/2 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('-/2'), Error, '-/2 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('-/2/2'), Error, '-/2/2 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('--/2'), Error, '--/2 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('0--25/2'), Error, '0--25/2 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('0/*'), Error, '0/* cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('20/'), Error, '20/ cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('/2'), Error, '/2 cannot be a valid day of month expression');
    test.throws(() => DayOfMonthExpression.from('jan-dec'), Error, 'jan-dec cannot be a valid day of month expression');

    test.end();
});

// Tests the validity of day of month expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not matching.
tap.test('Matching day of month expressions with *', (test) => {
    test.equal(DayOfMonthExpression.from('*').matches(1), true, '1 is a valid day of month when *');
    test.equal(DayOfMonthExpression.from('*').matches(31), true, '31 is a valid day of month when *');

    test.equal(DayOfMonthExpression.from('*').matches(32), false, '32 is not a valid day of month when *');
    test.equal(DayOfMonthExpression.from('*').matches(0), false, '0 is not a valid day of month when *');

    test.end();
});

// Tests the validity of day of month expressions with steps. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of step expressions', (test) => {
    let expression = DayOfMonthExpression.from('*/3');

    test.equal(expression.matches(0), false, '0 is not a valid day of month when 3 steps defined');
    test.equal(expression.matches(1), true, '1 is a valid day of month when 3 steps defined');
    test.equal(expression.matches(2), false, '2 is not a valid day of month when 3 steps defined');
    test.equal(expression.matches(3), false, '3 is not a valid day of month when 3 steps defined');
    test.equal(expression.matches(4), true, '4 is a valid day of month when 3 steps defined');

    expression = DayOfMonthExpression.from('5/3');

    test.equal(expression.matches(0), false, '0 is not a valid day of month when 5/3');
    test.equal(expression.matches(3), false, '3 is not a valid day of month when 5/3');
    test.equal(expression.matches(5), true, '5 is a valid day of month when 5/3');
    test.equal(expression.matches(6), false, '6 is not a valid day of month when 5/3');
    test.equal(expression.matches(7), false, '7 is not a valid day of month when 5/3');
    test.equal(expression.matches(8), true, '8 is a valid day of month when 5/3');

    test.end();
});

// Tests the validity of day of month expressions with range. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of range expressions', (test) => {
    let expression = DayOfMonthExpression.from('1-10');

    test.equal(expression.matches(1), true, '1 is a valid day of month for 1-10');
    test.equal(expression.matches(2), true, '2 is a valid day of month for 1-10');
    test.equal(expression.matches(10), true, '10 is a valid day of month for 1-10');
    test.equal(expression.matches(11), false, '11 is not a valid day of month for 1-10');

    expression = DayOfMonthExpression.from('10-15/3');

    test.equal(expression.matches(10), true, '10 is a valid day of month when 10-15/3');
    test.equal(expression.matches(11), false, '11 is not a valid day of month when 10-15/3');
    test.equal(expression.matches(13), true, '13 is a valid day of month when 10-15/3');
    test.equal(expression.matches(16), false, '16 is not a valid day of month when 10-15/3');

    test.end();
});
