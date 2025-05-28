export const Icon = {
  general: {
    question: '\ueb8b',
  },
  speaker: {
    overamplified: '\uf14b',
    high: '\ue050',
    medium: '\ue04d',
    low: '\ue04e',
    muted: '\ue04f',
  },
  microphone: {
    overamplified: '\ue029',
    high: '\ue029',
    medium: '\ue029',
    low: '\ue029',
    muted: '\ue02b',
  },
  weather: {
    '113': '\uf00d', //"Sunny", day
    '116': '\uf002', //"PartlyCloudy", day
    '119': '\uf041', //"Cloudy",
    '122': '\uf013', //"VeryCloudy",
    '143': '\uf014', //"Fog", day
    '248': '\uf014', //"Fog", day
    '260': '\uf014', //"Fog", day
    '176': '\uf009', //"LightShowers", day
    '263': '\uf009', //"LightShowers", day
    '353': '\uf009', //"LightShowers", day
    '266': '\uf008', //"LightRain", day
    '293': '\uf008', //"LightRain", day
    '296': '\uf008', //"LightRain", day
    '179': '\uf0b2', //"LightSleetShowers", day
    '362': '\uf0b2', //"LightSleetShowers", day
    '365': '\uf0b2', //"LightSleetShowers", day
    '374': '\uf0b2', //"LightSleetShowers", day
    '182': '\uf0b2', //"LightSleet", day
    '185': '\uf0b2', //"LightSleet", day
    '281': '\uf0b2', //"LightSleet", day
    '284': '\uf0b2', //"LightSleet", day
    '311': '\uf0b2', //"LightSleet", day
    '314': '\uf0b2', //"LightSleet", day
    '317': '\uf0b2', //"LightSleet", day
    '377': '\uf0b2', //"LightSleet", day
    '350': '\uf0b2', //"LightSleet", day
    '200': '\uf00e', //"ThunderyShowers", day
    '386': '\uf00e', //"ThunderyShowers", day
    '227': '\uf00a', //"LightSnow", day
    '320': '\uf00a', //"LightSnow", day
    '323': '\uf00a', //"LightSnowShowers", day
    '326': '\uf00a', //"LightSnowShowers", day
    '368': '\uf00a', //"LightSnowShowers", day
    // Use neutral for heavy stuff
    '230': '\uf064', //"HeavySnow",
    '329': '\uf064', //"HeavySnow",
    '332': '\uf064', //"HeavySnow",
    '338': '\uf064', //"HeavySnow",
    '299': '\uf019', //"HeavyShowers",
    '305': '\uf019', //"HeavyShowers",
    '356': '\uf019', //"HeavyShowers",
    '302': '\uf019', //"HeavyRain",
    '308': '\uf019', //"HeavyRain",
    '359': '\uf019', //"HeavyRain",
    '371': '\uf01b', //"HeavySnowShowers",
    '395': '\uf01b', //"HeavySnowShowers",
    '335': '\uf01b', //"HeavySnowShowers",
    '389': '\uf01e', //"ThunderyHeavyRain",
    '392': '\uf01d', //"ThunderySnowShowers",
    // Night~
    '\uf00d': '\uf02e', // Night
    '\uf002': '\uf086', //"PartlyCloudy"
    '\uf014': '\uf04a', //"Fog"
    '\uf008': '\uf028', //"LightRain"
    '\uf0b2': '\uf0b3', //"LightSleetShowers", day
    '\uf00e': '\uf06a', //"ThunderyShowers", day
    '\uf00a': '\uf038', //"LightSnow", day
  },
  wired: {
    power: '\ue63c',
    poweroff: '\ue646',
  },
  wifi: {
    none: '\ue1d0',
    bad: '\uebe4',
    low: '\uebd6',
    normal: '\uebe1',
    good: '\ue1d8',
  },
  workspace: {
    active: '\ue837',
    inactive: '\ue836',
    occupied: '\ue86c',
  },
  systray: {
    unhide: '\ue2ea',
    hide: '\ue5e1',
  },
  modes: {
    search: '\ue037',
    execute: '\uf866',
    power: '\ue8ac',
  },
  system: {
    cpu: '\ue30d',
    memory: '\ue322',
    disk: '\uf80e',
  },
  battery: {
    '100': '\ue1a4',
    '90': '\uebd2',
    '80': '\uebd4',
    '70': '\uebe2',
    '60': '\uebdd',
    '50': '\uebe0',
    '40': '\uebd9',
    '30': '\uebd9',
    '20': '\uebdc',
    '10': '\uebdc',
    '0': '\uebdc',
    charging: {
      '100': '\uf67d', // technically, no charge, but eh  :)
      '90': '\uf0a7',
      '80': '\uf0a6',
      '70': '\uf0a6',
      '60': '\uf0a5',
      '50': '\uf0a5',
      '40': '\uf0a4',
      '30': '\uf0a3',
      '20': '\uf0a3',
      '10': '\ue1a3',
      '0': '\ue1a3',
    }
  }
}

export const MaterialIcon = (icon: string, size = '1.0rem', class_name = 'icon-material') => Widget.Label({
  class_name,
  css: `font-size: ${size}`,
  label: icon,
})
