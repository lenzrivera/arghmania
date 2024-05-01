import Ajv from 'ajv';

const BEATMAP_SCHEMA = {
  type: 'object',
  properties: {
    meta: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        artist: { type: 'string' },
        beats_per_minute: { type: 'number', minimum: 1 },
        beats_per_measure: { type: 'integer', minimum: 1 },

        approach_rate: { type: 'number', exclusiveMinimum: 0 },
        start_offset: { type: 'number', minimum: 0 },
      },
      required: ['title', 'artist', 'beats_per_minute', 'beats_per_measure'],
    },
    events: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          at: { type: 'number', minimum: 0 },
          type: { type: 'string', enum: ['bpmi', 'bpme', 'ar'] },
          value: { type: 'number', minimum: 0 },
        },
        required: ['at', 'type', 'value'],
      },
    },
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          at: { type: 'number', minimum: 0 },
          type: { type: 'string', enum: ['hit', 'hold', 'trick'] },
          track: { type: 'number', enum: [0, 1, 2, 3] },

          until: { type: 'number', minimum: { $data: '1/at' } },
          to_track: { type: 'integer', enum: [0, 1, 2, 3] },
        },
        required: ['at', 'type', 'track'],
        allOf: [
          {
            if: {
              properties: {
                type: { const: 'hold' },
              },
            },
            then: {
              required: ['until'],
            },
          },
          {
            if: {
              properties: {
                type: { const: 'trick' },
              },
            },
            then: {
              required: ['to_track'],
            },
          },
        ],
      },
    },
  },
  required: ['meta', 'events', 'notes'],
};

const ajv = new Ajv({ $data: true });
const validate = ajv.compile(BEATMAP_SCHEMA);

export function validateBeatmapJSON(beatmapJSON) {
  if (!validate(beatmapJSON)) {
    const err0 = validate.errors[0];
    return `Validation Error: ${err0.message} (${err0.keyword}; ${err0.instancePath})`;
  }

  return '';
}
