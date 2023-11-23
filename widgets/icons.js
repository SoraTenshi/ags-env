import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const Icon = {
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
    sunny: '\ue81a',
    cloudy: '\ue2bd',
    windy: '\uefd8',
    rainy: '\uf176',
    thunderstorm: '\uebdb',
    partly_cloudy: '\uf172',
    cloudy_night: '\uea46',
    clear_night: '\uf159',
    sunny_snowy: '\ue819',
    foggy: '\ue818',
    snowy: '\ue2cd',
    storm: '\uf070',
    hail: '\uf67f',
    mist: '\ue188',
    rainy_snowy: '\uf61d',
  },
}

export const MaterialIcon = (/** @type {string} */ icon) => Widget.Label({
  class_name: `icon-material`,
  css: "font-family: 'Material Symbols Sharp'",
  label: icon,
})
