import React from "react";
import { toast } from "sonner";
import { Email, Phone, ArrowRight } from "@/icons";

import EmailComponent from "../Email";

export default function Content() {
  return (
    <div className="flex flex-row justify-between bg-[#dfff1f] px-12 py-8 min-w-full h-full">
      <Nav />
    </div>
  );
}


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
    <div className="flex md:flex-row flex-col gap-20 w-full shrink-0 items-end pb-20">
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <div className="inline-flex items-center gap-0.5 bg-black px-5 py-1.5 rounded-full w-auto max-w-40 h-auto max-h-12 text-[#dfff1f]">
          <Phone className="mt-1.5 w-6 h-6" stroke="#dfff1f" />
          Contact Me
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="font-semibold text-4xl">Get in Touch with Me</h4>
          <p className="text-xl">
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
            <label 
            className="w-full"
            htmlFor={`form-item-${index}`}>{item.label}</label>
            {item.type === "textarea" ? (
              <textarea
                id={`form-item-${index}`}
                onChange={(e) => handleOnChange(e, index)}
                className="bg-transparent w-full p-2 border-b border-black focus:border-b-2 w-96 h-32 focus:outline-none"
              />
            ) : (
              <input
                id={`form-item-${index}`}
                onChange={(e) => handleOnChange(e, index)}
                className="w-full bg-transparent p-2 border-b border-black focus:border-b-2 w-96 h-12 focus:outline-none"
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
    </div>
  );
};
