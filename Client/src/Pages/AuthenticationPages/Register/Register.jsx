import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerificationCode = ({
  control,
  errors,
  handleChange,
  handleBackspace,
}) => {
  return (
    <div className="flex space-x-2 justify-evenly">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col">
          <Controller
            name={`verificationCode[${index}]`}
            defaultValue={""}
            control={control}
            rules={{
              // required: "",
              pattern: {
                value: /^[0-9]{1}$/,
                message: "Only digits allowed",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                id={`verificationCode-${index}`}
                type="text"
                maxLength="1"
                className={`w-12 h-12 border-2 rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all ${
                  errors?.verificationCode?.[index]
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="—"
                onChange={(e) => {
                  field.onChange(e);
                  handleChange(e, index);
                }}
                onKeyDown={(e) => handleBackspace(e, index)}
              />
            )}
          />
          {errors?.verificationCode?.[index] && (
            <span className="text-red-500 text-sm">
              {errors.verificationCode[index].message}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const Register = () => {
  const [step, setStep] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [expirationTime, setExpirationTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [sendVerificationLoading, setSendVerificationLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useForm({
    mode: "onChange", // Enable validation on change
  });

  // Watch password and confirmPassword fields
  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  useEffect(() => {
    if (expirationTime) {
      const interval = setInterval(() => {
        const timeLeft = Math.max(0, expirationTime - Date.now());
        setRemainingTime(timeLeft);
        if (timeLeft === 0) {
          clearInterval(interval);
          setResendDisabled(false); // Enable resend button when time is up
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [expirationTime]);

  const sendVerificationEmail = async () => {
    const email = getValues("email");
    setSendVerificationLoading(true);
    try {
      const response = await fetch("http://localhost:5000/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Verification email sent! Check your inbox.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          // transition: Bounce,
        });

        setExpirationTime(data.expirationTime);
        setRemainingTime(data.expirationTime - Date.now());
        setResendDisabled(true);
        setStep(3);
      } else {
        toast.success(`${data.message}Failed to send verification email.`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.success(
        `${error.message} Something went wrong. Please try again.`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
    setSendVerificationLoading(false);
  };

  const resendVerificationCode = async () => {
    const email = getValues("email");
    // setSendVerificationLoading(true);
    try {
      const response = await fetch("http://localhost:5000/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Verification email resent! Check your inbox.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setExpirationTime(data.expirationTime);
        setRemainingTime(data.expirationTime - Date.now());
        setResendDisabled(true);
      } else {
        toast.error("Failed to resend verification email.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    // setSendVerificationLoading(false);
  };

  const verifyCode = async () => {
    const email = getValues("email");
    const code = getValues("verificationCode").join(""); // Join the digits into a string
    setSendVerificationLoading(true);
    // Check if any code field is empty or invalid

    try {
      const response = await fetch("http://localhost:5000/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        // setIsVerified(true);
        setStep(4);
      } else {
        toast.error("Invalid verification code !", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setSendVerificationLoading(false);
  };

  const onSubmit = (data) => {
    toast.success("Registration Successful! 🎉", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    navigate("/");
    console.log("Registration Data:", data);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Format the remaining time in mm:ss format
  const formatRemainingTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleChange = (e, index) => {
    if (e.target.value && index < 5) {
      document.getElementById(`verificationCode-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      document.getElementById(`verificationCode-${index - 1}`).focus();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-2xl  rounded-xl bg-white mt-40">
      <h2 className="text-2xl font-bold text-center mb-4 font-sans">
        Register
      </h2>

      {/* Steps Indicator */}
      <ul className="steps mb-6 w-full font-bold">
        <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
          {step > 1 ? "✔️" : "Name"}
        </li>
        <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
          {step > 2 ? "✔️" : "Email"}
        </li>
        <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
          {step > 3 ? "✔️" : "Verify"}
        </li>
        <li className={`step ${step >= 4 ? "step-primary" : ""}`}>
          {step > 4 ? "✔️" : "Password"}
        </li>
      </ul>

      {/* Step Forms */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <>
            <div className="form-control">
              <label className="label" htmlFor="name">
                <span className="label-text text-lg font-semibold">
                  First Name :
                </span>
              </label>
              <Controller
                name="firstName"
                control={control}
                defaultValue={""}
                rules={{
                  required: "First Name is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Name can only contain letters and spaces",
                  },
                }}
                render={({ field, fieldState }) => {
                  const { error } = fieldState;
                  return (
                    <div className="relative">
                      <input
                        {...field}
                        id="firstName"
                        className={`w-full border rounded px-3 py-2 text-gray-700 transition-colors hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${
                          error
                            ? "border-red-500"
                            : field.value
                            ? "border-green-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter Your First Name"
                        aria-invalid={!!error}
                        aria-describedby="name-feedback"
                      />
                      {error ? (
                        <p
                          id="name-feedback"
                          className="text-red-500 text-sm mt-1"
                        >
                          {error.message}
                        </p>
                      ) : field.value ? (
                        <p
                          id="name-feedback"
                          className="text-green-500 text-sm mt-1"
                        >
                          First Name is valid!
                        </p>
                      ) : null}
                    </div>
                  );
                }}
              />
            </div>

            <div className="form-control">
              <label className="label text-lg font-semibold">Last Name :</label>
              <Controller
                name="lastName"
                defaultValue={""}
                control={control}
                rules={{
                  required: "Last Name is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Name can only contain letters and spaces",
                  },
                }}
                render={({ field, fieldState }) => {
                  const { error } = fieldState;
                  return (
                    <div className="relative">
                      <input
                        {...field}
                        id="lastName"
                        className={`w-full border rounded px-3 py-2 text-gray-700 transition-colors hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${
                          error
                            ? "border-red-500"
                            : field.value
                            ? "border-green-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter Your Last Name"
                        aria-invalid={!!error}
                        aria-describedby="lastName-feedback"
                      />
                      {error ? (
                        <p
                          id="lastName-feedback"
                          className="text-red-500 text-sm mt-1"
                        >
                          {error.message}
                        </p>
                      ) : field.value ? (
                        <p
                          id="lastName-feedback"
                          className="text-green-500 text-sm mt-1"
                        >
                          Last name is valid!
                        </p>
                      ) : null}
                    </div>
                  );
                }}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="btn btn-primary w-full text-xl"
                onClick={nextStep}
                disabled={
                  !getValues("firstName") ||
                  !getValues("lastName") ||
                  errors.firstName ||
                  errors.lastName
                } // Ensure button is disabled if fields are empty or invalid
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text text-lg font-semibold">
                  Email :
                </span>
              </label>
              <Controller
                name="email"
                defaultValue={""}
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field, fieldState }) => {
                  const { error } = fieldState;
                  return (
                    <div className="relative">
                      <input
                        {...field}
                        id="email"
                        className={`w-full border rounded px-3 py-2 text-gray-700 transition-colors hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${
                          error
                            ? "border-red-500"
                            : field.value
                            ? "border-green-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter Email ID"
                        aria-invalid={!!error}
                        aria-describedby="email-feedback"
                      />
                      {error ? (
                        <p
                          id="email-feedback"
                          className="text-red-500 text-sm mt-1"
                        >
                          {error.message}
                        </p>
                      ) : field.value ? (
                        <p
                          id="email-feedback"
                          className="text-green-500 text-sm mt-1"
                        >
                          Email is valid!
                        </p>
                      ) : null}
                    </div>
                  );
                }}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="btn text-lg w-[30%]"
                onClick={prevStep}
              >
                Back
              </button>

              <button
                type="button"
                className="btn btn-primary w-[50%] text-xl"
                onClick={sendVerificationEmail}
                disabled={
                  sendVerificationLoading || !getValues("email") || errors.email
                }
              >
                {sendVerificationLoading ? (
                  <>Processing...</>
                ) : (
                  <>Send Verification</>
                )}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Enter the Verification Code:
                </span>
              </label>
              <VerificationCode
                control={control}
                errors={errors}
                handleChange={handleChange}
                handleBackspace={handleBackspace}
              />

              {remainingTime && (
                <p className="text-lg text-center mt-4">
                  Time left to verify: {formatRemainingTime(remainingTime)}
                </p>
              )}
              <div>
                <button
                  type="button"
                  className="btn btn-primary w-full text-lg"
                  onClick={resendVerificationCode}
                  disabled={sendVerificationLoading || resendDisabled}
                >
                  {sendVerificationLoading ? (
                    <>Processing...</>
                  ) : (
                    <>Resend Code</>
                  )}
                </button>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="btn text-lg w-[30%]"
                  onClick={prevStep}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="btn btn-primary w-[50%] text-xl"
                  onClick={verifyCode}
                  disabled={
                    sendVerificationLoading ||
                    !getValues("verificationCode") || // Check if code exists
                    getValues("verificationCode").length !== 6 || // Ensure it's exactly 6 digits
                    getValues("verificationCode").some(
                      (digit) => !/^[0-9]$/.test(digit)
                    ) // Ensure all characters are valid digits
                  }
                >
                  {sendVerificationLoading ? (
                    <>Processing...</>
                  ) : (
                    <> Verify Code</>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text text-lg font-semibold">
                  Password:
                </span>
              </label>
              <Controller
                name="password"
                control={control}
                defaultValue={""}
                rules={{
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      "Password must be at least 8 characters long, include uppercase, lowercase, and a number",
                  },
                }}
                render={({ field, fieldState }) => {
                  const { error } = fieldState;
                  return (
                    <div className="relative">
                      <input
                        {...field}
                        id="password"
                        type="password"
                        className={`w-full border rounded px-3 py-2 text-gray-700 transition-colors hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter Password"
                        aria-invalid={!!error}
                        aria-describedby="password-feedback"
                      />
                      {error && (
                        <p
                          id="password-feedback"
                          className="text-red-500 text-sm mt-1"
                        >
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-control mt-4">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text text-lg font-semibold">
                  Confirm Password:
                </span>
              </label>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue={""}
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                }}
                render={({ field, fieldState }) => {
                  const { error } = fieldState;
                  return (
                    <div className="relative">
                      <input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        className={`w-full border rounded px-3 py-2 text-gray-700 transition-colors hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Confirm Password"
                        aria-invalid={!!error}
                        aria-describedby="confirmPassword-feedback"
                      />
                      {error && (
                        <p
                          id="confirmPassword-feedback"
                          className="text-red-500 text-sm mt-1"
                        >
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="btn text-lg w-[30%]"
                onClick={prevStep}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={
                  !password || !confirmPassword || password !== confirmPassword
                }
                className={`px-4 py-2 rounded btn btn-primary w-[50%] text-xl${
                  !password || !confirmPassword || password !== confirmPassword
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
              >
                Register
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
