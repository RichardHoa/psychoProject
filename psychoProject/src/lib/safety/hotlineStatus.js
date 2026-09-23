const HOTLINE_TIMEZONE = 'Asia/Ho_Chi_Minh';
const OPEN_MINUTES = 13 * 60;
const CLOSE_MINUTES = 20 * 60 + 30;
const OPERATING_WEEKDAYS = new Set(['Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

export const HOTLINE_URL = 'https://duongdaynongngaymai.vn/';

const timeFormatter = new Intl.DateTimeFormat('en-US', {
	timeZone: HOTLINE_TIMEZONE,
	weekday: 'short',
	hour: 'numeric',
	minute: 'numeric',
	hourCycle: 'h23'
});

/**
 * Whether the Ngày Mai hotline is staffed at the given instant, evaluated in the
 * Asia/Ho_Chi_Minh timezone regardless of the host machine's local timezone.
 * Staffed hours: 13:00-20:30, Wednesday through Sunday.
 * @param {Date} [now]
 * @returns {{ inHours: boolean }}
 */
export function getHotlineStatus(now = new Date()) {
	const parts = Object.fromEntries(timeFormatter.formatToParts(now).map((p) => [p.type, p.value]));
	const minutesSinceMidnight = Number(parts.hour) * 60 + Number(parts.minute);
	const isOperatingDay = OPERATING_WEEKDAYS.has(parts.weekday);
	const isWithinWindow =
		minutesSinceMidnight >= OPEN_MINUTES && minutesSinceMidnight < CLOSE_MINUTES;

	return { inHours: isOperatingDay && isWithinWindow };
}
