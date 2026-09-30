import React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight } from "@/icons";
import { cn } from "@/lib/utils";

const arrowVariants: Variants = {
  visible: { opacity: 1, x: 0, y: 0, rotate: 0 },
  exitTop: { opacity: 0, x: "100%", y: "-100%", rotate: 45 },
  enterBottom: { opacity: 0, x: "-100%", y: "100%", rotate: -45 },
};

interface EmailComponentProps {
  children: React.ReactNode;
  href?: string;
}

const EmailComponent: React.FC<EmailComponentProps> & {
  Title: React.FC<{ children: React.ReactNode }>;
  Description: React.FC<{ children: React.ReactNode }>;
  Icon: React.FC<{ children: React.ReactNode }>;
} = ({ children, href }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Ok göstergesi tamamen dekoratif. Eskiden hem dış kapsayıcıda klavyeyle
  // erişilemeyen bir onClick, hem role="button" + tabIndex taşıyan bir div,
  // hem de içinde ayrı bir <Link> vardı: aynı hedef için üç iç içe geçmiş
  // etkileşim noktası. Artık tek etkileşimli element kartın kendisi.
  const arrow = (
    <div
      className="flex justify-center items-center bg-gray-200 p-6 rounded-full relative w-16 h-16 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={isHovered ? "arrow2" : "arrow1"}
          variants={arrowVariants}
          initial={isHovered ? "enterBottom" : "visible"}
          animate="visible"
          exit="exitTop"
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <ArrowRight className="w-6 h-6 text-gray-700" />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const body = (
    <>
      <div className="flex items-center gap-3 w-full">{children}</div>
      {arrow}
    </>
  );

  const className = cn(
    "flex justify-between items-center bg-white shadow-lg p-4 rounded-lg w-full",
    href
      ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#dfff1f]"
      : "cursor-default"
  );

  // mailto:/tel: için gerçek <a>. Eskiden window.open() ile açılıyordu; bu
  // hem klavyeyle erişilemiyor hem de linkin hedefi kullanıcıya görünmüyordu.
  if (href) {
    return (
      <motion.a
        href={href}
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {body}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {body}
    </motion.div>
  );
};

EmailComponent.Title = ({ children }) => (
  <span className="!text-gray-700 text-light text-sm">{children}</span>
);

EmailComponent.Description = ({ children }) => (
  <span className="font-medium text-gray-900 text-md">{children}</span>
);

EmailComponent.Icon = ({ children }) => (
  <div className="bg-[#f6f7f9] p-3 rounded-lg">{children}</div>
);

export default EmailComponent;
