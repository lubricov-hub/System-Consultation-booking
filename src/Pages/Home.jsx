import { Calendar, Clock, UserCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Teacher Consultation Booking
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Schedule a consultation with your teachers. Book a time that works best
          for you to discuss academic progress, assignments, or any questions.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 text-center hover:shadow-md transition">
          <Calendar className="mx-auto text-blue-500 w-10 h-10 mb-4" />
          <h3 className="font-semibold text-lg">Choose Your Date</h3>
          <p className="text-gray-500 mt-2 text-sm">
            Select from available dates on the calendar
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 text-center hover:shadow-md transition">
          <Clock className="mx-auto text-purple-500 w-10 h-10 mb-4" />
          <h3 className="font-semibold text-lg">Pick a Time Slot</h3>
          <p className="text-gray-500 mt-2 text-sm">
            View available time slots and book instantly
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 text-center hover:shadow-md transition">
          <UserCheck className="mx-auto text-green-500 w-10 h-10 mb-4" />
          <h3 className="font-semibold text-lg">Get Confirmation</h3>
          <p className="text-gray-500 mt-2 text-sm">
            Receive instant confirmation via email
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition">
          Book a Teacher Consultation
        </button>

        <button className="border px-6 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition">
          View My Appointments
        </button>
      </div>
    </div>
  );
}