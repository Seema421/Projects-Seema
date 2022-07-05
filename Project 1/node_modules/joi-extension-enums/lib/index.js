const Joi = require('joi');

module.exports = {
    name: 'any',
    base: Joi.any(),
    language: {
        enum: 'must be one of {{enum}}',
    },
    coerce(value, state, options) {
        // Pass the buck to 'any'
        const isRequired = this._flags.presence === 'required' || value !== undefined;
        if (!this._flags.enum) return value;
        if (value === undefined) value = this._flags.default;

        // Allow for adding extra valids like NULL
        const valids = this._valids._set;

        const enums = new Map(Object.entries(this._flags.enum));

        if (valids.has(value)) return value;
        if (enums.has(value)) return enums.get(value);
        if ([...enums.values()].some(v => v === value)) return value;

        return isRequired
            ?  this.createError('any.enum', { value, enum: [...enums.keys(), ...valids.keys()].filter(i => i !== null) }, state, options)
            : undefined;
},
    rules: [
        {
            name: 'enum',
            params: {
                enum: Joi.object(),
            },
            setup(params) {
                this._flags.enum = params.enum;
            },
        },
    ],
};
