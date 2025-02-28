import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Clipboard,
  CheckCircle,
  User,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MotorbikeFilled = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 16.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0M16.5 16.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0" />
    <path d="m5 9 5 1 2 4" />
    <path d="m9.5 9 2 4" />
    <path d="M15 9h2.8c1.1 0 2.1.6 2.6 1.5l2.1 3.5" />
  </svg>
);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideInFromLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

const slideInFromRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

const slideInFromBottom = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 relative overflow-hidden">
        {/* Decorative Shape */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-[800px] h-[800px] bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-800/20 dark:to-emerald-800/20 rounded-full opacity-20 transform -translate-y-1/2 -translate-x-1/2"></div>
        </motion.div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          <motion.div
            className="max-w-3xl"
            variants={slideInFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
              Reservasi Servis Motor Jadi Lebih Mudah
            </h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              Booking servis motor Anda di CikSpeed dengan cepat dan nyaman. Tak
              perlu antri, cukup beberapa klik untuk menjadwalkan servis motor
              kesayangan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="px-8 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                  >
                    Daftar Sekarang
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-500 dark:hover:bg-teal-950/50"
                  >
                    Masuk
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Icons Grid as Decoration */}
          <motion.div
            className="mt-12 grid grid-cols-3 gap-8 opacity-50"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="w-12 h-12 bg-teal-100 dark:bg-teal-800/30 rounded-lg flex items-center justify-center"
            >
              <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </motion.div>
            <motion.div
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg flex items-center justify-center"
              style={{ animationDelay: "0.5s" }}
            >
              <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <motion.div
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="w-12 h-12 bg-teal-100 dark:bg-teal-800/30 rounded-lg flex items-center justify-center"
              style={{ animationDelay: "1s" }}
            >
              <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Fitur Unggulan Kami
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: (
                  <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Reservasi Online",
                description:
                  "Jadwalkan servis motor Anda kapan saja dan di mana saja tanpa perlu datang ke bengkel.",
              },
              {
                icon: (
                  <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Pilih Slot Waktu",
                description:
                  "Pilih waktu yang tersedia sesuai kebutuhan Anda tanpa perlu mengantri.",
              },
              {
                icon: (
                  <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Konfirmasi Instan",
                description:
                  "Dapatkan konfirmasi reservasi secara instan setelah melakukan booking.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={slideInFromBottom}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:shadow-none dark:border dark:border-gray-700">
                  <CardContent className="pt-6">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-800/30 flex items-center justify-center mb-4 mx-auto"
                      whileHover={{
                        rotate: [0, 10, -10, 0],
                        transition: { duration: 0.5 },
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Cara Reservasi Servis
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: (
                  <User className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Daftar/Masuk",
                description: "Buat akun atau masuk ke akun yang sudah ada",
              },
              {
                icon: (
                  <MotorbikeFilled className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Tambah Kendaraan",
                description: "Masukkan data motor Anda",
              },
              {
                icon: (
                  <Clipboard className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Deskripsi Masalah",
                description: "Jelaskan gejala yang dialami motor Anda",
              },
              {
                icon: (
                  <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Pilih Waktu",
                description: "Pilih tanggal dan slot waktu yang tersedia",
              },
              {
                icon: (
                  <Check className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                ),
                title: "Konfirmasi",
                description: "Terima konfirmasi dari admin bengkel",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                variants={fadeIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-800/30 flex items-center justify-center mb-4"
                  whileHover={{
                    boxShadow: "0 0 0 8px rgba(20, 184, 166, 0.2)",
                    transition: {
                      duration: 0.3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
                {index < 4 && (
                  <motion.div
                    className="hidden md:block absolute mt-8 ml-32"
                    animate={{
                      x: [0, 10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-teal-500 dark:text-teal-400"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="mt-12 text-center"
            variants={slideInFromBottom}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Tidak menemukan gejala yang sesuai? Anda dapat mengisi form khusus
              untuk menjelaskan masalah yang dialami.
            </p>
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600">
                  Mulai Reservasi Sekarang
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section id="faq" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Pertanyaan yang Sering Diajukan
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto"
            variants={slideInFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Bagaimana cara membuat reservasi?",
                  answer:
                    "Daftar atau masuk ke akun Anda, tambahkan data kendaraan, pilih gejala yang dialami, pilih tanggal dan slot waktu yang tersedia, lalu tunggu konfirmasi dari admin.",
                },
                {
                  question: "Apakah saya bisa membatalkan reservasi?",
                  answer:
                    "Ya, Anda dapat membatalkan reservasi melalui akun Anda minimal 2 jam sebelum jadwal yang telah ditetapkan.",
                },
                {
                  question:
                    "Bagaimana jika gejala motor saya tidak ada dalam daftar?",
                  answer:
                    "Anda dapat mengisi form khusus dan menjelaskan gejala yang dialami motor Anda secara detail.",
                },
                {
                  question: "Berapa lama proses konfirmasi reservasi?",
                  answer:
                    "Konfirmasi reservasi biasanya dilakukan dalam waktu 30 menit hingga 1 jam setelah Anda melakukan reservasi.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-teal-200 dark:border-teal-800"
                >
                  <AccordionTrigger className="text-left font-bold text-lg text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
