import { motion } from "framer-motion";
import NavbarLanding from "../Components/NavbarLanding";
import Footer from "../Components/Footer";
import { FaCloudUploadAlt, FaShieldAlt, FaRobot, FaChartLine } from "react-icons/fa";

const Card = ({ icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.1)" }}
    className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:border-indigo-200 transition-all cursor-default group"
  >
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600 text-2xl mb-5 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="bg-white">
      <NavbarLanding />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              FINTECH • OCR • FRAUD DETECTION
            </motion.span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Automate invoices.{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Trust
              </span>{" "}
              your numbers.
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
              BillIQ intelligently reads your invoices, flags duplicates and suspicious entries, and provides actionable insights through a beautiful dashboard.
            </p>
            {/* FIXED BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Launch Dashboard
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center h-14 px-8 rounded-xl border-2 border-gray-200 font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                Explore Features
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Invoices Processed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-3xl filter blur-2xl opacity-20" />
            <div className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
              <div className="h-72 rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex flex-col items-center justify-center p-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 mx-auto">
                    <FaCloudUploadAlt className="text-4xl text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-900 mb-2">Invoice Preview</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 justify-center">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Upload → Extract → Review
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why teams choose{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              BillIQ
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your invoice processing workflow
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card icon={<FaCloudUploadAlt />} title="Frictionless Uploads">
            Drag & drop PDFs or images. We instantly parse dates, invoice numbers, and amounts with industry-leading accuracy.
          </Card>
          <Card icon={<FaShieldAlt />} title="Smart Fraud Detection">
            Advanced algorithms catch repeated invoice numbers and flag unusual amounts before they become problems.
          </Card>
          <Card icon={<FaRobot />} title="AI-Powered Extraction">
            Start with robust OCR technology, then leverage AI/ML for intelligent anomaly detection and insights.
          </Card>
          <Card icon={<FaChartLine />} title="Actionable Dashboards">
            Visualize trends, monitor vendor risks, and make data-driven decisions with beautiful, intuitive charts.
          </Card>
        </div>
      </section>
      {/* Benefits Section */}
      <section id="benefits" className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Built for modern finance teams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save time, reduce errors, and gain complete visibility into your invoicing process
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Save 80% Time", desc: "Automate manual data entry and free up your team for strategic work" },
              { title: "Reduce Errors", desc: "Eliminate human mistakes with AI-powered validation and verification" },
              { title: "Complete Visibility", desc: "Track every invoice from upload to approval in real-time" }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-white shadow-lg"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  {benefit.title}
                </div>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
