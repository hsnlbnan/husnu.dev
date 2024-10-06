import React from "react";
import { TextHoverEffect } from "../AnimatedText";
import { toast } from "sonner";
import Link from "next/link";

export default function Content() {
  return (
    <div className="flex flex-row justify-between bg-[#dfff1f] px-12 py-8 w-full h-full">
      <Section1 />
      <Section2 />
    </div>
  );
}

const Section1 = () => {
  return (
    <div>
      <Nav />
    </div>
  );
};

const Section2 = () => {
  return (
    <div>
      <div className="relative flex justify-between items-end">
        <div className="flex justify-start items-start">
          <TextHoverEffect text="contact with me" />
        </div>
      </div>
      {/* social media */}
      <div className="bottom-0 left-0 absolute flex gap-6 bg-black px-6 py-8 rounded-tl-3xl rounded-tr-3xl w-full">
        <Link href="https://github.com/hsnlbnan" className="text-white">
          github
        </Link>
        <Link href="https://twitter.com/hsnlbnan" className="text-white">
          twitter
        </Link>
        <Link href="https://linkedin.com/in/husnu" className="text-white">
          linkedin
        </Link>
        <Link href="mailto:hsnlbnan@gmail.com" className="text-white">
          mail
        </Link>
      </div>
    </div>
  );
};

const Nav = () => {
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
    // validate
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

    // send
    console.log(formItems);
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
        setFormItems((prev) => prev.map((item) => ({ ...item, value: "" })));
        toast.success("Message sent successfully!");
        // clear form
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the message.");
    }
  }

  return (
    <div className="flex gap-20 shrink-0">
      <div className="flex flex-col gap-2">
        {formItems.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label htmlFor={`form-item-${index}`}>{item.label}</label>
            {item.type === "textarea" ? (
              <textarea
                id={`form-item-${index}`}
                onChange={(e) => handleOnChange(e, index)}
                className="bg-transparent p-2 border-b border-black focus:border-b-2 w-96 h-32 focus:outline-none"
              />
            ) : (
              <input
                id={`form-item-${index}`}
                onChange={(e) => handleOnChange(e, index)}
                className="bg-transparent p-2 border-b border-black focus:border-b-2 w-96 h-12 focus:outline-none"
                type={item.type}
              />
            )}
          </div>
        ))}
        <button
          className="bg-black p-2 w-full text-white"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
      <div className="flex flex-col gap-2"></div>
    </div>
  );
};
