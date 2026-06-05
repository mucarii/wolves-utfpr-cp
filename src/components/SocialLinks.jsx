import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

const socials = [
  {
    icon: FaInstagram,
    href: "https://instagram.com/wolvesutfcp",
    label: "Instagram",
    hoverColor: "hover:text-pink-500",
  },
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/WOLVESUTFPRCP",
    label: "Facebook",
    hoverColor: "hover:text-blue-500",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@wolvesutfpr4157",
    label: "YouTube",
    hoverColor: "hover:text-red-500",
  },
  {
    icon: FaTiktok,
    href: "https://www.tiktok.com/@wolves.cornelio",
    label: "TikTok",
    hoverColor: "hover:text-white",
  },
];

export default function SocialLinks({ size = 18, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map(({ icon: Icon, href, label, hoverColor }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`social-icon text-gray-400 ${hoverColor}`}
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
}
