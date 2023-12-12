import Widget from 'resource:///com/github/Aylur/ags/widget.js';

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
    '113': '\ue430', //"Sunny",
    '116': '\uf172', //"PartlyCloudy",
    '119': '\uf172', //"Cloudy",
    '122': '\ue2bd', //"VeryCloudy",
    '143': '\ue818', //"Fog",
    '176': '\uf176', //"LightShowers",
    '179': '\uf60b', //"LightSleetShowers",
    '182': '\uf60b', //"LightSleet",
    '185': '\uf60b', //"LightSleet",
    '200': '\uebdb', //"ThunderyShowers",
    '227': '\ue2cd', //"LightSnow",
    '230': '\uf61c', //"HeavySnow",
    '248': '\ue818', //"Fog",
    '260': '\ue818', //"Fog",
    '263': '\uf176', //"LightShowers",
    '266': '\uf176', //"LightRain",
    '281': '\uf60b', //"LightSleet",
    '284': '\uf60b', //"LightSleet",
    '293': '\uf176', //"LightRain",
    '296': '\uf176', //"LightRain",
    '299': '\uf176', //"HeavyShowers",
    '302': '\uf61f', //"HeavyRain",
    '305': '\uf176', //"HeavyShowers",
    '308': '\uf61f', //"HeavyRain",
    '311': '\uf60b', //"LightSleet",
    '314': '\uf60b', //"LightSleet",
    '317': '\uf60b', //"LightSleet",
    '320': '\ue2cd', //"LightSnow",
    '323': '\ue2cd', //"LightSnowShowers",
    '326': '\ue2cd', //"LightSnowShowers",
    '329': '\ueb3b', //"HeavySnow",
    '332': '\ueb3b', //"HeavySnow",
    '335': '\ueb3b', //"HeavySnowShowers",
    '338': '\ueb3b', //"HeavySnow",
    '350': '\uf60b', //"LightSleet",
    '353': '\uf176', //"LightShowers",
    '356': '\uf176', //"HeavyShowers",
    '359': '\uf61f', //"HeavyRain",
    '362': '\uf60b', //"LightSleetShowers",
    '365': '\uf60b', //"LightSleetShowers",
    '368': '\ue2cd', //"LightSnowShowers",
    '371': '\ue2cd', //"HeavySnowShowers",
    '374': '\uf60b', //"LightSleetShowers",
    '377': '\uf60b', //"LightSleet",
    '386': '\uebdb', //"ThunderyShowers",
    '389': '\uebdb', //"ThunderyHeavyRain",
    '392': '\uebdb', //"ThunderySnowShowers",
    '395': '\uf61c', //"HeavySnowShowers",
    '\ue430': '\uf159', // Night
    '\uf172': '\uea46', // Partly cloudy, night
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
    active: '\ue146',
    inactive: '\ue835',
    occupied: '\ue909',
  },
  systray: {
    unhide: '\ue2ea',
    hide: '\ue5e1',
  },
  modes: {
    search: '\ue037',
    execute: '\uf866'
  }
}

export const MaterialIcon = ({ /** @type {string} */ icon, size = '1.0rem' }) => Widget.Label({
  class_name: `icon-material`,
  css: `font-family: 'Material Symbols Sharp'; font-size: ${size}`,
  label: icon,
})
