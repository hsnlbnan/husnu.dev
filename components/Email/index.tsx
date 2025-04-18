import React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight } from "@/icons";
import Link from "next/link";
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

  const handleClick = () => {
    if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <motion.div
      className={
        cn(
          "flex justify-between items-center bg-white shadow-lg p-4 rounded-lg w-full",
          href ? "cursor-pointer" : "cursor-default"
        )
      }
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 w-full">{children}</div>

      <div
        className="flex justify-center items-center bg-gray-200 p-6 rounded-full cursor-pointer relative w-16 h-16 overflow-hidden"
        role="button"
        aria-label="Daha fazla bilgi"
        tabIndex={0}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!isHovered ? (
            <motion.div
              key="arrow1"
              variants={arrowVariants}
              initial="visible"
              exit="exitTop"
              animate="visible"
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              {href ? (
                <Link href={href} aria-label="Daha fazla bilgi için tıklayın">
                  <ArrowRight className="w-6 h-6 text-gray-700" aria-hidden="true" />
                </Link>
              ) : (
                <ArrowRight className="w-6 h-6 text-gray-700" aria-hidden="true" />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="arrow2"
              variants={arrowVariants}
              initial="enterBottom"
              animate="visible"
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              {href ? (
                <Link href={href} aria-label="Daha fazla bilgi için tıklayın">
                  <ArrowRight className="w-6 h-6 text-gray-700" aria-hidden="true" />
                </Link>
              ) : (
                <ArrowRight className="w-6 h-6 text-gray-700" aria-hidden="true" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
