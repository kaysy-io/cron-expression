import tap from 'tap';
import { DayOfWeekExpression } from '.';

// Tests the validity of day of week expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones throw exceptions.
tap.test('Validity of day of week expressions', (test) => {
    test.doesNotThrow(() => DayOfWeekExpression.from('*'), '* is a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('1'), '1 is a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('7'), '7 is a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('3,6'), '3,6 is a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('sun'), 'sun is a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('SAT'), 'SAT is a valid day of week expression');

    test.throws(() => DayOfWeekExpression.from('8'), Error, '8 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('-1'), Error, '-1 cannot be a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('1/2'), '1/2 is a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('7/2'), '7/2 is a valid day of week expression');
    test.doesNotThrow(() => DayOfWeekExpression.from('sun-sat'), 'sun-sat is a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('7-5'), Error, '7-5 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('4-1/2'), Error, '4-1/2 cannot be a valid day of week expression');

    test.throws(() => DayOfWeekExpression.from(''), Error, 'Empty string cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('*-7/2'), Error, '*-7/2 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('-/2'), Error, '-/2 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('-/2/2'), Error, '-/2/2 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('--/2'), Error, '--/2 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('0--5/2'), Error, '0--5/2 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('0/*'), Error, '0/* cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('0/0'), Error, '0/0 cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('7/'), Error, '7/ cannot be a valid day of week expression');
    test.throws(() => DayOfWeekExpression.from('/2'), Error, '/2 cannot be a valid day of week expression');

    test.end();
});

// Tests the validity of day of week expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not matching.
tap.test('Matching day of week expressions with *', (test) => {
    test.equal(DayOfWeekExpression.from('*').matches(0), true, '0 is a valid day of week when *');
    test.equal(DayOfWeekExpression.from('*').matches(1), true, '1 is a valid day of week when *');
    test.equal(DayOfWeekExpression.from('*').matches(7), true, '7 is a valid day of week when *');

    test.equal(DayOfWeekExpression.from('*').matches(8), false, '8 is not a valid day of week when *');
    test.equal(DayOfWeekExpression.from('*').matches(-1), false, '-1 is not a valid day of week when *');

    test.end();
});

// Tests the validity of day of week expressions with steps. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of step expressions', (test) => {
    let expression = DayOfWeekExpression.from('*/3');

    test.equal(expression.matches(0), true, '0 is a valid day of week when 3 steps defined');
    test.equal(expression.matches(2), false, '2 is not a valid day of week when 3 steps defined');
    test.equal(expression.matches(3), true, '3 is a valid day of week when 3 steps defined');

    expression = DayOfWeekExpression.from('5/3');

    test.equal(expression.matches(3), false, '3 is not a valid day of week when 5/3');
    test.equal(expression.matches(5), true, '5 is a valid day of week when 5/3');
    test.equal(expression.matches(6), false, '6 is not a valid day of week when 5/3');
    test.equal(expression.matches(7), false, '7 is not a valid day of week when 5/3');

    test.end();
});

// Tests the validity of day of week expressions with range. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of range expressions', (test) => {
    let expression = DayOfWeekExpression.from('0-5');

    test.equal(expression.matches(1), true, '1 is a valid day of week for 0-5');
    test.equal(expression.matches(5), true, '5 is a valid day of week for 0-5');
    test.equal(expression.matches(7), false, '7 is not a valid day of week for 0-5');

    expression = DayOfWeekExpression.from('2-7/3');

    test.equal(expression.matches(2), true, '2 is a valid day of week when 2-7/3');
    test.equal(expression.matches(3), false, '3 is not a valid day of week when 2-7/3');
    test.equal(expression.matches(5), true, '5 is a valid day of week when 2-7/3');
    test.equal(expression.matches(7), false, '7 is not a valid day of week when 2-7/3');

    expression = DayOfWeekExpression.from('5-7');
    test.equal(expression.matches(0), true, '0 is not a valid day of week when 5-7');

    test.end();
});

// Tests the validity of day of week expressions as string. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('String expressions of day of weeks', (test) => {
    let expression = DayOfWeekExpression.from('MON-WED');

    test.equal(expression.matches(1), true, '1 is a valid day of week for MON-WED');
    test.equal(expression.matches(2), true, '2 is a valid day of week for MON-WED');
    test.equal(expression.matches(4), false, '4 is not a valid day of week for MON-WED');

    expression = DayOfWeekExpression.from('THU/3');

    test.equal(expression.matches(3), false, '3 is not a valid day of week when THU/3');
    test.equal(expression.matches(4), true, '4 is a valid day of week when THU/3');
    test.equal(expression.matches(5), false, '5 is not a valid day of week when THU/3');
    test.equal(expression.matches(7), true, '7 is a valid day of week when THU/3');

    expression = DayOfWeekExpression.from('MON-FRI/4');

    test.equal(expression.matches(1), true, '1 is a valid day of week when MON-FRI/4');
    test.equal(expression.matches(5), true, '5 is a valid day of week when MON-FRI/4');
    test.equal(expression.matches(4), false, '4 is not a valid day of week when MON-FRI/4');
    test.equal(expression.matches(6), false, '6 is not a valid day of week when MON-FRI/4');

    test.end();
});
