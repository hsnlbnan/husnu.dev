import React, { useState } from "react";
import { toast } from "sonner";
import { Email, Phone, ArrowRight } from "@/icons";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCheck, FiMail } from "react-icons/fi";

import EmailComponent from "../Email";

export default function Content() {
  return (
    <div className="flex flex-row justify-between bg-[#dfff1f] px-4 md:px-12 py-8 min-w-full h-full">
      <Nav />
    </div>
  );
}

const Nav = () => {
  // Formun durumu için daha anlamlı bir state yapısı oluşturalım
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formItems, setFormItems] = React.useState<
    {
      label: string;
      type: string;
      required: boolean;
      validation: string;
      value?: string;
    }[]
  >([
    { label: "Name", type: "text", required: true, validation: "name" },
    { label: "Email", type: "email", required: true, validation: "email" },
    {
      label: "Message",
      type: "textarea",
      required: true,
      validation: "message",
    },
  ]);

  function handleOnChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) {
    // Kullanıcı form alanlarından birini değiştirdiğinde, form durumunu 'idle' olarak ayarla
    if (formState === 'success') {
      setFormState('idle');
    }
    
    // update formItems
    setFormItems((prev) => {
      return prev.map((item, i) => {
        if (i === index) {
          return { ...item, value: e.target.value };
        }
        return item;
      });
    });
  }

  async function handleSubmit() {
    // Eğer zaten işlem yapılıyorsa veya başarı durumundaysak çık
    if (formState !== 'idle') return;

    // Validasyon işlemleri
    if (formItems.some((item) => !item.value)) {
      toast.error("Please fill all fields");
      return;
    }

    if (
      formItems.some(
        (item) =>
          item.validation === "email" && !(item.value ?? "").includes("@")
      )
    ) {
      toast.error("Invalid email");
      return;
    }

    if (
      formItems.some(
        (item) => item.validation === "name" && (item.value?.length ?? 0) < 3
      )
    ) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (
      formItems.some(
        (item) =>
          item.validation === "message" && (item.value?.length ?? 0) < 10
      )
    ) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    // Form gönderimi başlatıldı
    setFormState('loading');

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formItems.find((item) => item.label === "Name")?.value,
          email: formItems.find((item) => item.label === "Email")?.value,
          message: formItems.find((item) => item.label === "Message")?.value,
        }),
      });

      if (response.ok) {
        // Başarılı gönderim
        setFormState('success');
        
        // Başarılı mesajını göster ve ardından formu temizle
        setTimeout(() => {
          setFormItems((prev) => prev.map((item) => ({ ...item, value: "" })));
          toast.success("Message sent successfully!");
          // Form başarı durumunda kalacak, sadece kullanıcı bir şeyler yazdığında sıfırlanacak
        }, 2000);
      } else {
        // Sunucu hatası
        toast.error("Failed to send message.");
        setFormState('idle');
      }
    } catch (error) {
      // Bağlantı veya diğer hatalar
      toast.error("An error occurred while sending the message.");
      setFormState('idle');
    }
  }

  return (
    <div className="flex md:flex-row flex-col gap-20 w-full shrink-0 items-end pb-20">
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <div className="inline-flex items-center gap-0.5 bg-black px-5 py-1.5 rounded-full w-auto max-w-40 h-auto max-h-12 text-[#dfff1f]">
          <Phone className="mt-1.5 w-6 h-6" stroke="#dfff1f" />
          Contact Me
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="font-semibold text-4xl text-gray-700">Get in Touch with Me</h4>
          <p className="text-xl text-gray-500">
            You can contact me with your problems, bugs, new developments or
            projects.
          </p>

          <EmailComponent href="mailto:hsnlbnan@gmail.com">
            <EmailComponent.Icon>
              <Email className="w-6 h-6" stroke="#333" />
            </EmailComponent.Icon>
            <div className="flex flex-col w-full">
              <EmailComponent.Title>Email</EmailComponent.Title>
              <EmailComponent.Description>
                hsnlbnan@gmail.com
              </EmailComponent.Description>
            </div>
          </EmailComponent>
          <div data-cal-link="husnu" data-cal-config='{"theme":"dark"}'>
            <EmailComponent>
              <EmailComponent.Icon>
                <Email className="w-6 h-6" stroke="#333" />
              </EmailComponent.Icon>
              <div className="flex flex-col w-full">
                <EmailComponent.Title>Or give us a meet</EmailComponent.Title>
                <EmailComponent.Description>
                  Book a meeting
                </EmailComponent.Description>
              </div>
            </EmailComponent>
          </div>
          <EmailComponent href="tel:+905532200016">
            <EmailComponent.Icon>
              <Phone className="w-6 h-6" stroke="#333" />
            </EmailComponent.Icon>
            <div className="flex flex-col w-full">
              <EmailComponent.Title>Phone</EmailComponent.Title>
              <EmailComponent.Description>
                +90 553 220 00 16
              </EmailComponent.Description>
            </div>
          </EmailComponent>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/2">
        {formItems.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 w-full">
            <label className="w-full text-gray-900" htmlFor={`form-item-${index}`}>
              {item.label}
            </label>
            {item.type === "textarea" ? (
              <textarea
                id={`form-item-${index}`}
                onChange={(e) => handleOnChange(e, index)}
                className="bg-transparent text-black w-full p-2 rounded-none border-b border-black focus:border-b-2 w-96 h-32 focus:outline-none"
              />
            ) : (
              <input
                id={`form-item-${index}`}
                onChange={(e) => handleOnChange(e, index)}
                className="w-full bg-transparent text-black p-2 border-b rounded-none border-black focus:border-b-2 w-96 h-12 focus:outline-none"
                type={item.type}
              />
            )}
          </div>
        ))}
        <motion.button
          className={`bg-black p-2 w-full text-white relative overflow-hidden flex items-center justify-center h-14 rounded-md ${formState !== 'idle' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleSubmit}
          disabled={formState !== 'idle'}
          initial={{ opacity: 1 }}
          whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
          whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
        >
          <AnimatePresence mode="wait">
            {formState === 'idle' && (
              <motion.div 
                key="send-text"
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <span>Send Message</span>
                <FiSend className="ml-2" />
              </motion.div>
            )}
            
            {formState === 'loading' && (
              <motion.div 
                key="loading"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <motion.div className="flex items-center gap-3">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Sending...
                  </motion.div>
                </motion.div>
                
                {/* Enhanced flying emails animation with trajectory path */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Email envelope + trajectory path animation */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={`mail-${i}`}
                      className="absolute text-white"
                      style={{
                        top: `${35 + i * 6}%`,
                        left: `${25 + i * 8}%`
                      }}
                      initial={{ x: -40, y: 20, opacity: 0, scale: 0.2, filter: "drop-shadow(0 0 8px rgba(223, 255, 31, 0.2))" }}
                      animate={{ 
                        x: [
                          -40, 
                          -20 + i * 15, 
                          20 + i * 10, 
                          60 + i * 5, 
                          100 + i * 5
                        ], 
                        y: [
                          20, 
                          -20 - i * 5, 
                          -40 - i * 2, 
                          -30 + i * 5, 
                          -10 + i * 10
                        ], 
                        opacity: [0, 0.7, 1, 0.7, 0],
                        scale: [0.3, 0.6, 0.8, 0.6, 0.4],
                        rotate: [0, i % 2 === 0 ? 10 : -10, 0, i % 2 === 0 ? -8 : 8, 0],
                        filter: [
                          "drop-shadow(0 0 3px rgba(223, 255, 31, 0.3))",
                          "drop-shadow(0 0 5px rgba(223, 255, 31, 0.5))",
                          "drop-shadow(0 0 8px rgba(223, 255, 31, 0.7))",
                          "drop-shadow(0 0 5px rgba(223, 255, 31, 0.5))",
                          "drop-shadow(0 0 3px rgba(223, 255, 31, 0.3))"
                        ]
                      }}
                      transition={{ 
                        duration: 3.5 - i * 0.4, 
                        repeat: Infinity, 
                        repeatType: "loop",
                        delay: i * 0.5,
                        times: [0, 0.2, 0.5, 0.8, 1],
                        ease: "easeInOut"
                      }}
                    >
                      <FiMail size={18 + i * 3} />
                    </motion.div>
                  ))}
                
                  {/* Enhanced particle effects */}
                  {[...Array(12)].map((_, i) => {
                    const size = 1 + Math.random() * 4;
                    const speed = 1.2 + Math.random() * 1.2;
                    const startDelay = Math.random() * 2;
                    
                    return (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: size,
                          height: size,
                          top: `${40 + (Math.random() * 20 - 10)}%`,
                          left: `${30 + (Math.random() * 20 - 10)}%`,
                          background: i % 3 === 0 ? 
                            'white' : 
                            `rgba(223, 255, 31, ${0.6 + Math.random() * 0.4})`,
                          boxShadow: i % 3 === 0 ? 
                            '0 0 4px rgba(255, 255, 255, 0.8)' :
                            '0 0 6px rgba(223, 255, 31, 0.8)'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          x: [0, 40 + i * 6, 100 + i * 3],
                          y: [-5, -25 - i * 2, -40 + i * 3],
                          opacity: [0, 0.9, 0],
                          scale: [0.8, 1.2, 0.3]
                        }}
                        transition={{ 
                          duration: speed, 
                          repeat: Infinity, 
                          repeatType: "loop",
                          delay: startDelay,
                          times: [0, 0.4, 1],
                          ease: "easeOut"
                        }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
            
            {formState === 'success' && (
              <motion.div 
                key="success"
                className="flex items-center justify-center gap-2 text-white relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }}
              >
                {/* Animasyonlu check icon - geliştirilmiş çizilme efekti */}
                <motion.div className="relative w-6 h-6 mr-1">
                  <motion.svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#dfff1f"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1,
                        opacity: [0, 1]
                      }}
                      transition={{ 
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.path
                      d="M8 12L11 15L16 9"
                      stroke="#dfff1f"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ 
                        duration: 0.3,
                        delay: 0.3,
                        ease: "easeOut"
                      }}
                    />
                  </motion.svg>
                </motion.div>
                
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-medium"
                >
                  Thanks for your message!
                </motion.span>
                
                {/* Success burst animation - improved */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Radiating circles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`circle-${i}`}
                      className="absolute rounded-full border-2 border-[#dfff1f]"
                      style={{ 
                        left: '50%',
                        top: '50%',
                        translateX: '-50%',
                        translateY: '-50%',
                      }}
                      initial={{ width: 10, height: 10, opacity: 1, scale: 0.5 }}
                      animate={{ 
                        width: 10, 
                        height: 10, 
                        opacity: [1, 0], 
                        scale: [0.5, 3.5 - i * 0.5] 
                      }}
                      transition={{ 
                        duration: 1.2 + i * 0.2, 
                        delay: 0.3 + i * 0.2,
                        repeat: 1,
                        ease: "easeOut"
                      }}
                    />
                  ))}

                  {/* Confetti particles */}
                  {[...Array(20)].map((_, i) => {
                    const angle = Math.random() * 360;
                    const distance = 30 + Math.random() * 80;
                    const size = 3 + Math.random() * 6;
                    
                    return (
                      <motion.div
                        key={`confetti-${i}`}
                        className="absolute rounded-lg bg-[#dfff1f]"
                        style={{ 
                          width: size,
                          height: size,
                          left: '50%',
                          top: '50%',
                          rotate: Math.random() * 360
                        }}
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 1,
                          scale: 0
                        }}
                        animate={{ 
                          x: `${distance * Math.cos(angle * Math.PI / 180)}px`,
                          y: `${distance * Math.sin(angle * Math.PI / 180)}px`,
                          opacity: [1, 0],
                          scale: [0, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 1 + Math.random() * 0.5,
                          delay: 0.3,
                          ease: "easeOut" 
                        }}
                      />
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
