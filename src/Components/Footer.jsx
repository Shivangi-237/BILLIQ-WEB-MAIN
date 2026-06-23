import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-32">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid gap-8 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Ready to transform your invoice workflow?
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Join hundreds of companies automating their invoice processing with confidence.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:justify-self-end"
          >
            {/* FIXED: Proper opening <a> tag */}
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all text-lg"
            >
              Get Started Free →
            </a>
          </motion.div>
        </div>
      </div>
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} BillIQ. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
