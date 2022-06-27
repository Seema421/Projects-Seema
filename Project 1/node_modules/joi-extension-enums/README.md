# joi-enum-extension

A Joi extension that allows for Enum validation.

The `enum()` type extends on the `Joi.any()` type. The `enum` type takes an object:

```
const BaseJoi = require('joi');
const EnumExtension = require('joi-extension-enums');
const Joi = BaseJoi.extend(EnumExtension);

const schema = Joi.any().enum({ ONE: 1, TWO: 2 });

schema.validate('TWO'); // value: 2
schema.validate('THREE'); // ValidationError: "value" must be one of [ONE, TWO]
```

You can also allow some extra *allowed* values:

```
const schema = Joi.any().allow(null, 4).enum({ ONE: 1, TWO: 2 });

schema.validate(null); // value: null
schema.validate(5); // ValidationError: "value" must be one of [ONE, TWO, 4]
```

Note that both the Enum key as value are considered valid:
```
const schema = Joi.any().enum({ ONE: 1, TWO: 2 });

schema.validate('ONE'); // value: 1
schema.validate(1); // value: 1
```


For more examples, have a peek at the [tests](test/enum.test.js).

### Installing

`npm install joi-extension-enums`

## Running the tests

`npm install && npm test`

## Authors

* [samover](https://github.com/samover)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgements

Inspired by [joi-enums-extension](https://github.com/westyler/joi-enums-extension) by [WesTyler](https://github.com/WesTyler)
