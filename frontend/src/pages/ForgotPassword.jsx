import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

function ForgotPassword() {
  const { serverUrl } = useContext(AuthContext);

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      return toast.error("Enter your email");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${serverUrl}/api/auth/forgot-password`,
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message);
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      return toast.error("Enter OTP");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message);
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!password) {
      return toast.error("Enter new password");
    }

    if (password.length < 6) {
      return toast.error("Password must be 6 characters");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message);

        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
  if (error.response?.status === 403) setStep(1); // OTP window khatam, dobara shuru karo

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[380px] p-8 rounded-2xl shadow-lg">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-600 mb-5"
        >
          <FaArrowLeft />
          Back
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>

        <p className="text-center text-gray-500 mb-6">Step {step} of 3</p>

        <div className="flex gap-2 justify-center mb-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-2 w-12 rounded-full ${
                step >= item ? "bg-black" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 text-gray-500"
            >
              Change Email
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-3 rounded-lg mb-4"
              />

              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
