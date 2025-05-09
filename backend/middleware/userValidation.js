import userValidationSchema from "../validationSchema/userValidationSchema.js";

export function registerUserValidation(req, res, next) {
  const { error, value } = userValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  console.log("Validation result:", value);

  if (error) {
    const errorMessage = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  if (typeof value.birth_date === "number") {
    const today = new Date();
    const birthYear = today.getFullYear() - value.birth_date;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    value.birth_date = `${birthYear}-${month}-${day}`;
  }

  if (typeof value.birth_date === "string" && Date.parse(value.birth_date)) {
    value.birth_date = new Date(value.birth_date).toISOString().split("T")[0];
  }

  const today = new Date();
  const birthDate = new Date(value.birth_date);
  if (birthDate > today) {
    return res.status(400).json({
      error: "Gimimo data negali būti vėlesnė nei šiandien.",
    });
  }

  req.body = value;
  next();
}
