import React from "react";

import {
  FiInstagram,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiTwitch,
} from "react-icons/fi";

import WordPullUp from "./MenuItem";

const menuItemsData = [
  {
    id: 1,
    name: "Hakkımda",
    link: "/about",
  },
  {
    id: 2,
    name: "İşlerim",
    link: "/works",
  },
  {
    id: 3,
    name: "Blog",
    link: "/blog",
  },
  {
    id: 4,
    name: "İletişim",
    link: "/contact",
  },
];

const socialMediaAccounts = [
  {
    id: 1,
    name: "GitHub",
    link: "https://github.com/hsnlbnan",
    icon: <FiGithub />,
  },
  {
    id: 2,
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/husnu/",
    icon: <FiLinkedin />,
  },
  {
    id: 3,
    name: "Twitter",
    link: "https://twitter.com/hsnlbnan",
    icon: <FiTwitter />,
  },
  {
    id: 4,
    name: "Instagram",
    link: "https://www.instagram.com/hsnlbnan/",
    icon: <FiInstagram />,
  },
  {
    id: 5,
    name: "Twitch",
    link: "https://www.twitch.tv/hsnlbnan",
    icon: <FiTwitch />,
  },
];

const Menu = () => {
  return (
    <div className="flex flex-col justify-between">
      <nav className="flex flex-col gap-2">
        {menuItemsData.map((item) => (
          <a key={item.id} href={item.link}>
            <WordPullUp words={item.name} />
          </a>
        ))}
      </nav>

      <div className="mt-24">
        {socialMediaAccounts.map((account) => (
          <a
            key={account.id}
            href={account.link}
            className="inline-block p-2"
            target="_blank"
            rel="noreferrer"
          >
            {account.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Menu;
