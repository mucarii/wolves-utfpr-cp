import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa'

const socials = [
  { icon: FaInstagram, href: 'https://instagram.com/wolvesutfcp', label: 'Instagram', hoverColor: 'hover:text-pink-500' },
  { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook', hoverColor: 'hover:text-blue-500' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube', hoverColor: 'hover:text-red-500' },
  { icon: FaTiktok, href: 'https://tiktok.com', label: 'TikTok', hoverColor: 'hover:text-white' },
  { icon: FaWhatsapp, href: 'https://wa.me/5500000000000', label: 'WhatsApp', hoverColor: 'hover:text-green-400' },
]

export default function SocialLinks({ size = 18, className = '' }) {
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
  )
}
