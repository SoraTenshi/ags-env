const Conversion = {
  Ampm: {
    "PM": "午後",
    "AM": "午前",
  },
  Day: {
    "Mon": "月",
    "Tue": "火",
    "Wed": "水",
    "Thu": "木",
    "Fri": "金",
    "Sat": "土",
    "Sun": "日",
  }
}

type AmPm = 'AM' | 'PM';
type Day =  keyof typeof Conversion.Day;

export const Clock = () => Widget.Button({
  class_name: 'clock-bg',
  child: Widget.Box({
    children: [
      Widget.Label({
        class_name: 'ampm',
        setup: (self: ReturnType<typeof Widget.Label>) => self.poll(1000, (self: ReturnType<typeof Widget.Label>) => Utils.execAsync(['date', '+%p'])
          .then((ampm: AmPm) => self.label = Conversion.Ampm[ampm]).catch(print)),
      }),
      Widget.Label({
        class_name: 'clock',
        xpad: 10,
        setup: (self: ReturnType<typeof Widget.Label>) => self.poll(1000, (self: ReturnType<typeof Widget.Label>) => Utils.execAsync(['date', '+%I:%M:%S\n%y-%m-%d'])
          .then((date: string )=> self.label = date).catch(print)),
      }),
      Widget.Label({
        class_name: 'day',
        setup: (self: ReturnType<typeof Widget.Label>) => self.poll(1000, (self: ReturnType<typeof Widget.Label>) => Utils.execAsync(['date', '+%a'])
          .then((day: string) => self.label = Conversion.Day[day as Day]).catch(console.error)),
      }),
    ],
  }),
});

