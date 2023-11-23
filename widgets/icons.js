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
}

export const MaterialIcon = (/** @type {string} */ icon) => Widget.Label({
  class_name: `icon-material`,
  css: "font-family: 'Material Symbols Sharp'",
  label: icon,
})
