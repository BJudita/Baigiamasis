import Joi from "joi";

const userValidationSchema = Joi.object({
  name: Joi.string()
    .min(4)
    .max(100)
    .pattern(/^\s*\S+(?:\s+\S+)+\s*$/)
    .required()
    .messages({
      "string.pattern.base": "Pilną vardą turi sudaryti bent du žodžiai.",
    }),
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required()
    .messages({
      "string.email": "Neteisingas el. pašto adresas.",
      "string.empty": "El. pašto adresas yra privalomas.",
    }),
  birth_date: Joi.alternatives()
    .try(
      Joi.date().iso().less("now"),
      Joi.number().integer().min(1).max(150),
      Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
      Joi.string()
        .pattern(/^\d+$/)
        .custom((value, helpers) => {
          const num = parseInt(value, 10);
          if (num < 1 || num > 150) {
            return helpers.error("number.base");
          }
          return num;
        }, "String Age Conversion")
    )
    .required()
    .messages({
      "alternatives.match":
        "Prašome įvesti gimimo datą (YYYY-MM-DD) arba amžių.",
      "any.required": "Gimimo data arba amžius yra privalomas.",
    }),
});

export default userValidationSchema;
