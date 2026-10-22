import React from "react";

function About() {
  const features = [
    {
      title: "Quality Products",
      desc: "We carefully select products that match quality, comfort and latest trends.",
    },
    {
      title: "Fast Delivery",
      desc: "Quick and reliable delivery service to make your shopping experience better.",
    },
    {
      title: "Secure Payment",
      desc: "Your payments are safe with secure and trusted payment methods.",
    },
    {
      title: "Customer Support",
      desc: "Our team is always ready to help you whenever you need assistance.",
    },
  ];

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-20 py-10">
      {/* HERO SECTION */}

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-5">
          About <span className="text-gray-500">DukaanX</span>
        </h1>

        <p className="max-w-3xl mx-auto text-gray-600 text-sm md:text-base">
          DukaanX is a modern ecommerce platform designed to provide high
          quality products, smooth shopping experience and trusted service for
          every customer.
        </p>
      </div>

      {/* STORY */}

      <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <div>
          <h2 className="text-3xl font-semibold mb-5">Our Story</h2>

          <p className="text-gray-600 leading-7">
            We started DukaanX with a simple mission — to make online shopping
            easier, faster and more reliable. Our goal is to bring amazing
            products together with a seamless user experience where customers
            can discover, choose and purchase products effortlessly.
          </p>

          <p className="text-gray-600 leading-7 mt-4">
            From quality checking to fast delivery, we focus on every small
            detail to make our customers happy.
          </p>
        </div>

        <div className="bg-gray-100 rounded-xl h-72 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* WHY CHOOSE */}

      <div className="mb-20">
        <h2 className="text-center text-3xl font-semibold mb-10">
          Why Choose Us?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-xl mb-3">{item.title}</h3>

              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}

      <div className="bg-black text-white rounded-xl grid grid-cols-2 md:grid-cols-4 gap-8 p-10 text-center">
        <div>
          <h2 className="text-3xl font-bold">10K+</h2>

          <p className="text-gray-300">Happy Customers</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">500+</h2>

          <p className="text-gray-300">Products</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">50+</h2>

          <p className="text-gray-300">Brands</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">24/7</h2>

          <p className="text-gray-300">Support</p>
        </div>
      </div>
    </div>
  );
}

export default About;
