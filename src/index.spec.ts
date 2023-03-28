import tap from 'tap';
import { Cron } from '.';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Tests cron expressions can be created and matches checked. Always function and every minute
// are checked for positive and negative responses.
tap.test('Cron works on every minute tests', (test) => {
    test.equal(Cron.always().isValid(), true, 'Always function is valid whenever executed');
    test.equal(Cron.from('* * * * *').isValid(), true, 'Every minute cron is valid whenever executed');

    test.throws(() => Cron.from('15-7/3 * * * *'), Error, 'Invalid 15-7/3 * * * * expression should throw error');
    test.throws(() => Cron.from('15-7/3 * * * * *'), Error, 'Invalid expression should throw error');

    test.end();
});

// Tests cron expressions can be created with custom minute expression and checked for
// positive and negative responses
tap.test('Cron allows setting custom minute', (test) => {
    const now = dayjs().tz('UTC', true);

    test.equal(Cron.always().minute(now.minute().toString()).isValid(), true, 'Setting a minute works');
    test.throws(() => Cron.always().minute('15-7/3'), Error, 'Invalid 15-7/3 expression should throw error');

    test.end();
});

// Tests cron expressions can be created with custom hour expression and checked for
// positive and negative responses
tap.test('Cron allows setting custom hour', (test) => {
    const now = dayjs().tz('UTC', true);

    test.equal(Cron.always().hour(now.hour().toString()).isValid(), true, 'Setting a hour works');
    test.throws(() => Cron.always().hour('15-7/3'), Error, 'Invalid 15-7/3 expression should throw error');

    test.end();
});

// Tests cron expressions can be created with custom day of month expression and checked for
// positive and negative responses
tap.test('Cron allows setting custom day of month', (test) => {
    const now = dayjs().tz('UTC', true);

    test.equal(Cron.always().dayOfMonth(now.date().toString()).isValid(), true, 'Setting a day of month works');
    test.throws(() => Cron.always().dayOfMonth('15-7/3'), Error, 'Invalid 15-7/3 expression should throw error');

    test.end();
});

// Tests cron expressions can be created with custom month expression and checked for
// positive and negative responses
tap.test('Cron allows setting custom month', (test) => {
    const now = dayjs().tz('UTC', true);
    const month = now.month() + 1;

    test.equal(Cron.always().month(month.toString()).isValid(), true, 'Setting a month works');
    test.throws(() => Cron.always().month('15-7/3'), Error, 'Invalid 15-7/3 expression should throw error');

    test.end();
});

// Tests cron expressions can be created with custom day of week expression and checked for
// positive and negative responses
tap.test('Cron allows setting custom day of week', (test) => {
    const now = dayjs().tz('UTC', true);

    test.equal(Cron.always().dayOfWeek(now.day().toString()).isValid(), true, 'Setting a day of week works');
    test.throws(() => Cron.always().dayOfWeek('15-7/3'), Error, 'Invalid 15-7/3 expression should throw error');

    test.end();
});

// Tests cron expressions can be created with custom timezone and checked for
// positive and negative responses
tap.test('Cron allows setting custom timezone', (test) => {
    const now = dayjs().tz('UTC', true);

    const cron = Cron.always().hour(now.hour().toString());

    test.equal(cron.timezone('Asia/Calcutta').isValid(), false, 'Cron in Asia/Calcutta and UTC current does not match');
    test.equal(cron.timezone('UTC').isValid(), true, 'UTC hour in cron and current time matches');

    test.end();
});
