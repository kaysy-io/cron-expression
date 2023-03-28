import tap from 'tap';
import { MinuteExpression } from '.';

// Tests the validity of minute expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones throw exceptions.
tap.test('Validity of minute expressions', (test) => {
    test.doesNotThrow(() => MinuteExpression.from('*'), '* is a valid minute expression');
    test.doesNotThrow(() => MinuteExpression.from('0'), '0 is a valid minute expression');
    test.doesNotThrow(() => MinuteExpression.from('59'), '59 is a valid minute expression');
    test.doesNotThrow(() => MinuteExpression.from('3,5'), '3,5 is a valid minute expression');

    test.throws(() => MinuteExpression.from('60'), Error, '60 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('-1'), Error, '-1 cannot be a valid minute expression');
    test.doesNotThrow(() => MinuteExpression.from('0/2'), '0/2 is a valid minute expression');
    test.doesNotThrow(() => MinuteExpression.from('59/2'), '59/2 is a valid minute expression');
    test.throws(() => MinuteExpression.from('15-10'), Error, '15-10 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('15-10/2'), Error, '15-10/2 cannot be a valid minute expression');

    test.throws(() => MinuteExpression.from(''), Error, 'Empty string cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('*-20/2'), Error, '*-20/2 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('-/2'), Error, '-/2 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('-/2/2'), Error, '-/2/2 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('--/2'), Error, '--/2 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('0--25/2'), Error, '0--25/2 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('0/*'), Error, '0/* cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('0/0'), Error, '0/0 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('20/'), Error, '20/ cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('/2'), Error, '/2 cannot be a valid minute expression');
    test.throws(() => MinuteExpression.from('jan-dec'), Error, 'jan-dec cannot be a valid minute expression');

    test.end();
});

// Tests the validity of minute expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not matching.
tap.test('Matching minute expressions with *', (test) => {
    test.equal(MinuteExpression.from('*').matches(0), true, '0 is a valid minute when *');
    test.equal(MinuteExpression.from('*').matches(59), true, '59 is a valid minute when *');

    test.equal(MinuteExpression.from('*').matches(60), false, '60 is not a valid minute when *');
    test.equal(MinuteExpression.from('*').matches(-1), false, '-1 is not a valid minute when *');

    test.end();
});

// Tests the validity of minute expressions with steps. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of step expressions', (test) => {
    let expression = MinuteExpression.from('*/3');

    test.equal(expression.matches(0), true, '0 is a valid minute when 3 steps defined');
    test.equal(expression.matches(1), false, '1 is not a valid minute when 3 steps defined');
    test.equal(expression.matches(2), false, '2 is not a valid minute when 3 steps defined');
    test.equal(expression.matches(3), true, '3 is a valid minute when 3 steps defined');

    expression = MinuteExpression.from('5/3');

    test.equal(expression.matches(0), false, '0 is not a valid minute when 5/3');
    test.equal(expression.matches(3), false, '3 is not a valid minute when 5/3');
    test.equal(expression.matches(5), true, '5 is a valid minute when 5/3');
    test.equal(expression.matches(6), false, '6 is not a valid minute when 5/3');
    test.equal(expression.matches(7), false, '7 is not a valid minute when 5/3');
    test.equal(expression.matches(8), true, '8 is a valid minute when 5/3');

    test.end();
});

// Tests the validity of minute expressions with range. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of range expressions', (test) => {
    let expression = MinuteExpression.from('0-10');

    test.equal(expression.matches(0), true, '0 is a valid minute for 0-10');
    test.equal(expression.matches(1), true, '1 is a valid minute for 0-10');
    test.equal(expression.matches(10), true, '10 is a valid minute for 0-10');
    test.equal(expression.matches(11), false, '11 is not a valid minute for 0-10');

    expression = MinuteExpression.from('10-15/3');

    test.equal(expression.matches(10), true, '10 is a valid minute when 10-15/3');
    test.equal(expression.matches(11), false, '11 is not a valid minute when 10-15/3');
    test.equal(expression.matches(13), true, '13 is a valid minute when 10-15/3');
    test.equal(expression.matches(16), false, '16 is not a valid minute when 10-15/3');

    test.end();
});
