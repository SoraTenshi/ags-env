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

export const Clock = () => Widget.Button({
  class_name: 'clock-bg',
  child: Widget.Box({
    children: [
      Widget.Label({
        class_name: 'ampm',
        setup: self => self.poll(1000, self => Utils.execAsync(['date', '+%p'])
          .then(ampm => self.label = Conversion.Ampm[ampm]).catch(console.error)),
      }),
      Widget.Label({
        class_name: 'clock',
        xpad: 10,
        setup: self => self.poll(1000, self => Utils.execAsync(['date', '+%I:%M:%S\n%y-%m-%d'])
          .then(date => self.label = date).catch(console.error)),
      }),
      Widget.Label({
        class_name: 'day',
        setup: self => self.poll(1000, self => Utils.execAsync(['date', '+%a'])
          .then(day => self.label = Conversion.Day[day]).catch(console.error)),
      }),
    ],
  }),
});

