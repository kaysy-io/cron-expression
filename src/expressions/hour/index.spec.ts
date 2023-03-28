import tap from 'tap';
import { HourExpression } from '.';

// Tests the validity of hour expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones throw exceptions.
tap.test('Validity of hour expressions', (test) => {
    test.doesNotThrow(() => HourExpression.from('*'), '* is a valid hour expression');
    test.doesNotThrow(() => HourExpression.from('0'), '0 is a valid hour expression');
    test.doesNotThrow(() => HourExpression.from('23'), '23 is a valid hour expression');
    test.doesNotThrow(() => HourExpression.from('3,15'), '3,15 is a valid hour expression');

    test.throws(() => HourExpression.from('24'), Error, '24 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('-1'), Error, '-1 cannot be a valid hour expression');
    test.doesNotThrow(() => HourExpression.from('0/2'), '0/2 is a valid hour expression');
    test.doesNotThrow(() => HourExpression.from('23/2'), '23/2 is a valid hour expression');
    test.throws(() => HourExpression.from('15-10'), Error, '15-10 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('15-10/2'), Error, '15-10/2 cannot be a valid hour expression');

    test.throws(() => HourExpression.from(''), Error, 'Empty string cannot be a valid hour expression');
    test.throws(() => HourExpression.from('*-20/2'), Error, '*-20/2 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('-/2'), Error, '-/2 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('-/2/2'), Error, '-/2/2 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('--/2'), Error, '--/2 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('0--25/2'), Error, '0--25/2 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('0/*'), Error, '0/* cannot be a valid hour expression');
    test.throws(() => HourExpression.from('20/'), Error, '20/ cannot be a valid hour expression');
    test.throws(() => HourExpression.from('/2'), Error, '/2 cannot be a valid hour expression');
    test.throws(() => HourExpression.from('jan-dec'), Error, 'jan-dec cannot be a valid hour expression');

    test.end();
});

// Tests the validity of hour expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not matching.
tap.test('Matching hour expressions with *', (test) => {
    test.equal(HourExpression.from('*').matches(0), true, '0 is a valid hour when *');
    test.equal(HourExpression.from('*').matches(23), true, '23 is a valid hour when *');

    test.equal(HourExpression.from('*').matches(24), false, '24 is not a valid hour when *');
    test.equal(HourExpression.from('*').matches(-1), false, '-1 is not a valid hour when *');

    test.end();
});

// Tests the validity of hour expressions with steps. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of step expressions', (test) => {
    let expression = HourExpression.from('*/3');

    test.equal(expression.matches(0), true, '0 is a valid hour when 3 steps defined');
    test.equal(expression.matches(1), false, '1 is not a valid hour when 3 steps defined');
    test.equal(expression.matches(2), false, '2 is not a valid hour when 3 steps defined');
    test.equal(expression.matches(3), true, '3 is a valid hour when 3 steps defined');

    expression = HourExpression.from('5/3');

    test.equal(expression.matches(0), false, '0 is not a valid hour when 5/3');
    test.equal(expression.matches(3), false, '3 is not a valid hour when 5/3');
    test.equal(expression.matches(5), true, '5 is a valid hour when 5/3');
    test.equal(expression.matches(6), false, '6 is not a valid hour when 5/3');
    test.equal(expression.matches(7), false, '7 is not a valid hour when 5/3');
    test.equal(expression.matches(8), true, '8 is a valid hour when 5/3');

    test.end();
});

// Tests the validity of hour expressions with range. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of range expressions', (test) => {
    let expression = HourExpression.from('0-10');

    test.equal(expression.matches(0), true, '0 is a valid hour for 0-10');
    test.equal(expression.matches(1), true, '1 is a valid hour for 0-10');
    test.equal(expression.matches(10), true, '10 is a valid hour for 0-10');
    test.equal(expression.matches(11), false, '11 is not a valid hour for 0-10');

    expression = HourExpression.from('10-15/3');

    test.equal(expression.matches(10), true, '10 is a valid hour when 10-15/3');
    test.equal(expression.matches(11), false, '11 is not a valid hour when 10-15/3');
    test.equal(expression.matches(13), true, '13 is a valid hour when 10-15/3');
    test.equal(expression.matches(16), false, '16 is not a valid hour when 10-15/3');

    test.end();
});
