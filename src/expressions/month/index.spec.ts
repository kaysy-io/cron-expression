import tap from 'tap';
import { MonthExpression } from '.';

// Tests the validity of month expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones throw exceptions.
tap.test('Validity of month expressions', (test) => {
    test.doesNotThrow(() => MonthExpression.from('*'), '* is a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('1'), '1 is a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('12'), '12 is a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('3,6'), '3,6 is a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('jan'), 'jan is a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('JAN'), 'JAN is a valid month expression');

    test.throws(() => MonthExpression.from('13'), Error, '13 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('0'), Error, '0 cannot be a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('1/2'), '1/2 is a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('12/2'), '12/2 is a valid month expression');
    test.doesNotThrow(() => MonthExpression.from('jan-dec'), 'jan-dec is a valid month expression');
    test.throws(() => MonthExpression.from('12-10'), Error, '12-10 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('12-10/2'), Error, '12-10/2 cannot be a valid month expression');

    test.throws(() => MonthExpression.from(''), Error, 'Empty string cannot be a valid month expression');
    test.throws(() => MonthExpression.from('*-20/2'), Error, '*-20/2 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('-/2'), Error, '-/2 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('-/2/2'), Error, '-/2/2 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('--/2'), Error, '--/2 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('0--25/2'), Error, '0--25/2 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('0/*'), Error, '0/* cannot be a valid month expression');
    test.throws(() => MonthExpression.from('0/0'), Error, '0/0 cannot be a valid month expression');
    test.throws(() => MonthExpression.from('20/'), Error, '20/ cannot be a valid month expression');
    test.throws(() => MonthExpression.from('/2'), Error, '/2 cannot be a valid month expression');

    test.end();
});

// Tests the validity of month expressions. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not matching.
tap.test('Matching month expressions with *', (test) => {
    test.equal(MonthExpression.from('*').matches(1), true, '1 is a valid month when *');
    test.equal(MonthExpression.from('*').matches(12), true, '12 is a valid month when *');

    test.equal(MonthExpression.from('*').matches(13), false, '13 is not a valid month when *');
    test.equal(MonthExpression.from('*').matches(0), false, '0 is not a valid month when *');

    test.end();
});

// Tests the validity of month expressions with steps. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of step expressions', (test) => {
    let expression = MonthExpression.from('*/3');

    test.equal(expression.matches(1), true, '1 is a valid month when 3 steps defined');
    test.equal(expression.matches(2), false, '2 is not a valid month when 3 steps defined');
    test.equal(expression.matches(3), false, '3 is not a valid month when 3 steps defined');
    test.equal(expression.matches(4), true, '4 is a valid month when 3 steps defined');

    expression = MonthExpression.from('5/3');

    test.equal(expression.matches(3), false, '3 is not a valid month when 5/3');
    test.equal(expression.matches(5), true, '5 is a valid month when 5/3');
    test.equal(expression.matches(6), false, '6 is not a valid month when 5/3');
    test.equal(expression.matches(7), false, '7 is not a valid month when 5/3');
    test.equal(expression.matches(8), true, '8 is a valid month when 5/3');

    test.end();
});

// Tests the validity of month expressions with range. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('Truthiness of range expressions', (test) => {
    let expression = MonthExpression.from('1-10');

    test.equal(expression.matches(1), true, '1 is a valid month for 0-10');
    test.equal(expression.matches(10), true, '10 is a valid month for 0-10');
    test.equal(expression.matches(11), false, '11 is not a valid month for 0-10');

    expression = MonthExpression.from('9-12/3');

    test.equal(expression.matches(9), true, '9 is a valid month when 9-12/3');
    test.equal(expression.matches(10), false, '10 is not a valid month when 9-12/3');
    test.equal(expression.matches(12), true, '12 is a valid month when 9-12/3');
    test.equal(expression.matches(13), false, '13 is not a valid month when 9-12/3');

    test.end();
});

// Tests the validity of month expressions as string. Pass different cron expressions and
// check valid ones are allowed and invalid ones are not allowed.
tap.test('String expressions of months', (test) => {
    let expression = MonthExpression.from('JAN-FEB');

    test.equal(expression.matches(1), true, '1 is a valid month for JAN-FEB');
    test.equal(expression.matches(2), true, '2 is a valid month for JAN-FEB');
    test.equal(expression.matches(3), false, '3 is not a valid month for JAN-FEB');

    expression = MonthExpression.from('MAR/3');

    test.equal(expression.matches(3), true, '3 is a valid month when MAR/3');
    test.equal(expression.matches(4), false, '4 is not a valid month when MAR/3');
    test.equal(expression.matches(6), true, '6 is a valid month when MAR/3');
    test.equal(expression.matches(7), false, '7 is not a valid month when MAR/3');

    expression = MonthExpression.from('MAY-AUG/5');

    test.equal(expression.matches(4), false, '4 is not a valid month when MAY-AUG/5');
    test.equal(expression.matches(5), true, '5 is a valid month when MAY-AUG/5');
    test.equal(expression.matches(8), false, '8 is not a valid month when MAY-AUG/5');
    test.equal(expression.matches(10), false, '10 is not a valid month when MAY-AUG/5');

    test.end();
});
