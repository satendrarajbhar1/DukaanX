import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-20 py-10">
      {/* HEADER */}

      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions or need help? Our support team is always ready to
          assist you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* CONTACT INFO */}

        <div>
          <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>

          <div className="space-y-5">
            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg">📍 Address</h3>

              <p className="text-gray-600 mt-2">
                DukaanX Store, Basti , Uttar Pardesh
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg">📞 Phone</h3>

              <p className="text-gray-600 mt-2">+91 7054330701</p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg">✉ Email</h3>

              <p className="text-gray-600 mt-2">
                support@satendrarajbhar936@gmail.com
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg">⏰ Working Hours</h3>

              <p className="text-gray-600 mt-2">
                Monday - Saturday
                <br />
                10:00 AM - 7:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Send Message</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border p-3 rounded-md outline-none focus:border-black"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border p-3 rounded-md outline-none focus:border-black"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="w-full border p-3 rounded-md outline-none focus:border-black"
            />

            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* SUPPORT SECTION */}

      <div className="mt-20 bg-gray-100 rounded-xl p-10 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Need Help With Your Order?
        </h2>

        <p className="text-gray-600 mb-6">
          Track your order, return products or get assistance from our customer
          support team.
        </p>

        <button className="bg-black text-white px-8 py-3 rounded-md">
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default Contact;
