/* eslint-disable no-alert */
import { useState , useEffect } from 'react';
import Link from 'next/link';
import { Send, Smile } from 'react-feather';

function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  useEffect(() => {
    if (isSubmitted) {
      const timeoutId = setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

      // Clear the timeout when the component is unmounted
      return () => clearTimeout(timeoutId);
    }
  }, [isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://potfolio-980dc-default-rtdb.firebaseio.com/foodies-delight.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">
        <Smile className="inline-block mr-2" /> Contact Us
      </h1>

      {isSubmitted ? (
        <div className="mb-4 text-green-600 p-4 bg-green-100 rounded">
          Thank you for your message! We'll get back to you soon. <Smile className="inline-block ml-2" />
          <Link href="/">
            <div className="cursor-pointer text-blue-500 hover:underline">Go to Home page</div>
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 text-red-600 p-4 bg-red-100 rounded">
              Something went wrong! Please try again later.
            </div>
          )}

          <p className="text-lg mb-4">Have questions or suggestions? Feel free to reach out to us.</p>

          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="john@example.com"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Type your message here..."
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
            >
              <Send className="inline-block mr-2" /> Send Message
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Contact;
