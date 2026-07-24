import { getPasswordRequirements } from "../../utils/authValidation";

import { validateRegisterForm } from "../../utils/authValidation";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const passwordRequirements = getPasswordRequirements(
  formData.password
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  async function handleSubmit(e) {
      e.preventDefault();

      const validationErrors = validateRegisterForm(formData);

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
    }

setIsSubmitting(true);

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Create Account</h1>

        <p>Create your ApplyFlow account.</p>

       <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
      >

          <div>
            <label>First Name</label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? "input-error" : ""}
            />

            {errors.firstName && (
              <p className="error-message">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label>Last Name</label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? "input-error" : ""}
            />

            {errors.lastName && (
              <p className="error-message">
              {errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />

            {errors.email && (
              <p className="error-message">
              {errors.email}
              </p>
            )}
          </div>


          <div>
            <label>Password</label>

            <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  className={errors.password ? "input-error" : ""}
/>

<div className="password-checklist">

  <span
    className={`password-rule ${
      passwordRequirements.minLength
        ? "valid"
        : "invalid"
    }`}
  >
    {passwordRequirements.minLength ? "✓" : "✗"} At least 8 characters
  </span>

  <span
    className={`password-rule ${
      passwordRequirements.uppercase
        ? "valid"
        : "invalid"
    }`}
  >
    {passwordRequirements.uppercase ? "✓" : "✗"} One uppercase letter
  </span>

  <span
    className={`password-rule ${
      passwordRequirements.lowercase
        ? "valid"
        : "invalid"
    }`}
  >
    {passwordRequirements.lowercase ? "✓" : "✗"} One lowercase letter
  </span>

  <span
    className={`password-rule ${
      passwordRequirements.number
        ? "valid"
        : "invalid"
    }`}
  >
    {passwordRequirements.number ? "✓" : "✗"} One number
  </span>

</div>

{errors.password && (
  <p className="error-message">
    {errors.password}
  </p>
)}
          </div>


          <div>
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
            />

            {errors.confirmPassword && (
              <p className="error-message">
                {errors.confirmPassword}
              </p>
            )}
          </div>


          <button
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">

          Already have an account?{" "}

          <Link to="/login">

            Log In

          </Link>

        </div>

      </div>
    </div>
  );
}