"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Email, Phone, ArrowRight } from "@/icons";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCheck, FiMail } from "react-icons/fi";

import EmailComponent from "../Email";
import { openCalBooking } from "@/lib/cal";
import { interpolate, type Dictionary } from "@/i18n/dictionaries";

export default function Content({ dict }: { dict: Dictionary }) {
  return (
    // `h-full` yerine `flex-1`: yükseklik ebeveynden miras alınmak yerine
    // flex konteynerde kalan alana yayılıyor, böylece footer 100vh'ye
    // ulaştığında alt tarafta boşluk kalmıyor.
    <div className="flex flex-1 flex-row justify-between bg-[#dfff1f] px-4 md:px-12 py-8 min-w-full">
      <Nav dict={dict} />
    </div>
  );
}

const Nav = ({ dict }: { dict: Dictionary }) => {
  // Formun durumu için daha anlamlı bir state yapısı oluşturalım
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formItems, setFormItems] = React.useState<
    {
      label: string;
      type: string;
      required: boolean;
      validation: string;
      value?: string;
    }[]
  >([
    { label: dict.contact.form.name, type: "text", required: true, validation: "name" },
    { label: dict.contact.form.email, type: "email", required: true, validation: "email" },
    {
      label: dict.contact.form.message,
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

    // Kullanıcı yazmaya başlayınca ilgili alanın hatasını temizle
    setErrors((prev) => {
      const validation = formItems[index]?.validation;
      if (!validation || !prev[validation]) return prev;
      const { [validation]: _removed, ...rest } = prev;
      return rest;
    });

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

  // Alan bazlı hata mesajları. Daha önce hatalar yalnızca toast ile
  // gösteriliyordu; hangi alanın hatalı olduğu ne görsel ne de programatik
  // olarak belliydi (aria-invalid / aria-describedby yoktu).
  function validate(
    items: typeof formItems
  ): Record<string, string> {
    const next: Record<string, string> = {};

    items.forEach((item) => {
      const value = item.value ?? "";

      if (!value.trim()) {
        next[item.validation] = interpolate(dict.contact.form.required, { field: item.label });
        return;
      }

      if (item.validation === "email" && !value.includes("@")) {
        next.email = dict.contact.form.invalidEmail;
      }

      if (item.validation === "name" && value.length < 3) {
        next.name = dict.contact.form.nameTooShort;
      }

      if (item.validation === "message" && value.length < 10) {
        next.message = dict.contact.form.messageTooShort;
      }
    });

    return next;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    // Eğer zaten işlem yapılıyorsa veya başarı durumundaysak çık
    if (formState !== 'idle') return;

    const nextErrors = validate(formItems);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]);
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
          // `validation` dile bağlı olmayan sabit anahtar; `label` çevrildiği
          // için ona göre arama Türkçe'de undefined dönerdi.
          name: formItems.find((item) => item.validation === "name")?.value,
          email: formItems.find((item) => item.validation === "email")?.value,
          message: formItems.find((item) => item.validation === "message")?.value,
        }),
      });

      if (response.ok) {
        // Başarılı gönderim
        setFormState('success');
        
        // Başarılı mesajını göster ve ardından formu temizle
        setTimeout(() => {
          setFormItems((prev) => prev.map((item) => ({ ...item, value: "" })));
          toast.success(dict.contact.form.sent);
          // Form başarı durumunda kalacak, sadece kullanıcı bir şeyler yazdığında sıfırlanacak
        }, 2000);
      } else {
        // Sunucu hatası
        toast.error(dict.contact.form.failed);
        setFormState('idle');
      }
    } catch (error) {
      // Bağlantı veya diğer hatalar
      toast.error(dict.contact.form.error);
      setFormState('idle');
    }
  }

  return (
    <div className="flex md:flex-row flex-col gap-20 w-full shrink-0 items-end pb-20">
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <div className="inline-flex items-center gap-0.5 bg-black px-5 py-1.5 rounded-full w-auto max-w-40 h-auto max-h-12 text-[#dfff1f]">
          <Phone className="mt-1.5 w-6 h-6" stroke="#dfff1f" />
          {dict.contact.badge}
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-4xl text-gray-900">{dict.contact.heading}</h2>
          <p className="text-xl text-gray-700">
            {dict.contact.paragraph}
          </p>

          <EmailComponent href="mailto:hsnlbnan@gmail.com">
            <EmailComponent.Icon>
              <Email className="w-6 h-6" stroke="#333" />
            </EmailComponent.Icon>
            <div className="flex flex-col w-full">
              <EmailComponent.Title>{dict.contact.emailLabel}</EmailComponent.Title>
              <EmailComponent.Description>
                hsnlbnan@gmail.com
              </EmailComponent.Description>
            </div>
          </EmailComponent>
          {/* <button>: Cal.com tetikleyicisi eskiden düz bir <div> idi,
              klavye veya ekran okuyucu ile açılamıyordu. */}
          <button
            type="button"
            onClick={openCalBooking}
            className="w-full text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#dfff1f]"
          >
            <EmailComponent>
              <EmailComponent.Icon>
                <Email className="w-6 h-6" stroke="#333" />
              </EmailComponent.Icon>
              <div className="flex flex-col w-full">
                <EmailComponent.Title>{dict.contact.meetLabel}</EmailComponent.Title>
                <EmailComponent.Description>
                  {dict.contact.meetValue}
                </EmailComponent.Description>
              </div>
            </EmailComponent>
          </button>
          <EmailComponent href="tel:+905532200016">
            <EmailComponent.Icon>
              <Phone className="w-6 h-6" stroke="#333" />
            </EmailComponent.Icon>
            <div className="flex flex-col w-full">
              <EmailComponent.Title>{dict.contact.phoneLabel}</EmailComponent.Title>
              <EmailComponent.Description>
                +90 553 220 00 16
              </EmailComponent.Description>
            </div>
          </EmailComponent>
        </div>
      </div>
      {/* Gerçek bir <form>: Enter ile gönderim, tarayıcı otomatik doldurma ve
          şifre yöneticisi entegrasyonu bunun olmadan çalışmıyordu.
          noValidate: doğrulamayı kendimiz yapıp erişilebilir hata mesajı
          gösteriyoruz. */}
      <form
        className="flex flex-col gap-2 w-full md:w-1/2"
        onSubmit={handleSubmit}
        noValidate
      >
        {formItems.map((item, index) => {
          const fieldId = `form-item-${index}`;
          const errorId = `${fieldId}-error`;
          const error = errors[item.validation];
          // min-h-[44px]: WCAG 2.5.8 hedef boyutu (eskiden 21.5px yükseklikti)
          const fieldClass = `w-full bg-transparent text-black p-2 rounded-none border-b border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#dfff1f] ${
            error ? "border-b-2 border-red-700" : "focus:border-b-2"
          }`;

          return (
            <div key={index} className="flex flex-col gap-2 w-full">
              <label className="w-full text-gray-900" htmlFor={fieldId}>
                {item.label}
                {item.required && (
                  <span aria-hidden="true" className="ml-0.5 text-gray-900">
                    *
                  </span>
                )}
              </label>
              {item.type === "textarea" ? (
                <textarea
                  id={fieldId}
                  name={item.validation}
                  value={item.value ?? ""}
                  onChange={(e) => handleOnChange(e, index)}
                  required={item.required}
                  aria-required={item.required}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={`${fieldClass} min-h-32`}
                />
              ) : (
                <input
                  id={fieldId}
                  name={item.validation}
                  value={item.value ?? ""}
                  onChange={(e) => handleOnChange(e, index)}
                  required={item.required}
                  aria-required={item.required}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  autoComplete={item.validation === "email" ? "email" : "name"}
                  className={`${fieldClass} min-h-[44px]`}
                  type={item.type}
                />
              )}
              {error && (
                <p id={errorId} className="text-sm font-medium text-red-800">
                  {error}
                </p>
              )}
            </div>
          );
        })}
        <motion.button
          type="submit"
          className={`bg-black p-2 w-full text-white relative overflow-hidden flex items-center justify-center h-14 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#dfff1f] ${formState !== 'idle' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
                <span>{dict.contact.form.submit}</span>
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
                    {dict.contact.form.sending}
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
      </form>
    </div>
  );
};
