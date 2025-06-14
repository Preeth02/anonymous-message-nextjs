"use client"
// // HeroSection.jsx
// export default function HeroSection() {
//   return (
//     <section className="bg-white dark:bg-gray-900 min-h-[80vh] flex items-center justify-center px-4">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
//           Receive Honest Anonymous Messages
//         </h1>
//         <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
//           Create your anonymous message link, share it with others, and receive unfiltered thoughts from friends, followers, or strangers. No login required to send.
//         </p>
//         <div className="flex justify-center space-x-4">
//           <a
//             href="/sign-up"
//             className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
//           >
//             Get Started
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }
// HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-[90vh] flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-6">
          Speak Freely, Stay Anonymous
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Create your anonymous message profile and invite others to send you honest, unfiltered messages — without revealing their identity. Privacy-first. No signups for senders.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/sign-up"
            className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:scale-105 transition-transform"
          >
            Get Started
          </a>
          {/* <a
            href="#features"
            className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Explore Features
          </a> */}
        </div>
      </div>
    </section>
  );
}
