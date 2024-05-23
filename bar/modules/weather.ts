import { Response } from 'types/utils/fetch.js';
import { Icon } from 'widgets/icons.js';

const tenMinutes: number = 1000 * 60 * 10;

const location = Variable<string>("");

type WeatherCode = keyof typeof Icon.weather;

const twelveToTwentyFour = (s: string) => {
  const time = s.split(' ');
  const [hoursStr, minutesStr] = time[0].split(':');
  let hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const ampm = time[1].toUpperCase();

  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  }
  if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
}

const isDayTime = (sunset: Date, sunrise: Date, now: Date) => {
  const ret = sunset.getTime() > now.getTime() || now.getTime() > sunrise.getTime();
  return ret;
}

export const Weather = () => Widget.Box({
  class_name: 'weather',
  has_tooltip: true,
  children: [Widget.Label({
    class_name: 'weather-icon',
    css: "font-family: 'Material Symbols Sharp'",
    label: Icon.general.question,
  }), Widget.Label({
    class_name: 'weather-temp',
    label: "?°C",
  }),
  ],

  setup: (self: ReturnType<typeof Widget.Label>) => {
    self.poll(tenMinutes, () => {
      Utils.fetch('http://ipinfo.io/city')
        .then((response: Response) => response.text().then(res => {
          location.value = res.trim();
        }));

    });

    self.hook(location, (self: ReturnType<typeof Widget.Label>) => {
      const url = `http://wttr.in/${location.value}?format=j1`;
      Utils.fetch(url)
        .then((result: Response) => result.json().then(res => {
          const weather = res;
          const weatherCondition = weather.current_condition[0];
          //const currentTime = twelveToTwentyFour(weatherCondition['localObsDateTime'].substring(11));
          const sunSetDate = weather.weather[0].date;
          let sunRiseDate = weather.weather[0].date;
          sunRiseDate = sunRiseDate.split('-');
          sunRiseDate = `${sunRiseDate[0]}-${sunRiseDate[1]}-${String(Number(sunRiseDate[2]) + 1).padStart(2, '0')}`;
          const sunSet = twelveToTwentyFour(weather.weather[0].astronomy[0].sunset);
          const sunRise = twelveToTwentyFour(weather.weather[0].astronomy[0].sunrise);
          const sunset = new Date(`${sunSetDate}T${sunSet}`);
          const sunrise = new Date(`${sunRiseDate}T${sunRise}`);
          const current = new Date();
          // const current = new Date(`${sunSetDate}T${currentTime}`);

          const isDay = isDayTime(sunset, sunrise, current);

          let icon = Icon.weather[weatherCondition.weatherCode as WeatherCode];
          const night = Icon.weather[icon as WeatherCode];
          icon = isDay ? icon : (night ?? icon);

          const temp = weatherCondition.temp_C;
          self.children[0].label = icon;
          self.children[1].label = `${temp.replaceAll('+', '')}°C`;

          const location = weather.nearest_area[0];
          const city = location.areaName[0].value;
          const country = location.country[0].value;
          self.tooltip_markup = `Location: ${city}, ${country}` + '\n' +
            `FeelsLike: ${weatherCondition.FeelsLikeC.replaceAll('+', '')}°C` + '\n' +
            `Humidity: ${weatherCondition.humidity}%` + '\n' +
            `Weather: ${weatherCondition.weatherDesc[0]['value']}`;
        }))
        .catch((err: Error) => console.error(err));
    });
  },
});
