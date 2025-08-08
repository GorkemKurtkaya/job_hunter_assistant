import Link from "next/link";
import {
  GitHubIcon,
  LinkedInIcon,
} from "./icons";
import { Globe } from "lucide-react";

interface SocialAccountsProps {
  githubUrl?: string;
  linkedinUrl?: string;
  personalWebsite?: string | null;
}

export function SocialAccounts({ githubUrl, linkedinUrl, personalWebsite }: SocialAccountsProps) {
  const accounts = [
    ...(githubUrl ? [{
      platform: "GitHub",
      url: githubUrl,
      Icon: GitHubIcon,
    }] : []),
    ...(linkedinUrl ? [{
      platform: "LinkedIn",
      url: linkedinUrl,
      Icon: LinkedInIcon,
    }] : []),
    ...(personalWebsite ? [{
      platform: "Personal Website",
      url: personalWebsite,
      Icon: Globe,
    }] : []),
  ];

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4.5">
      <h4 className="mb-3.5 font-medium text-dark dark:text-white">
        Sosyal Medya
      </h4>
      <div className="flex items-center justify-center gap-3.5">
        {accounts.map(({ Icon, ...item }) => (
          <Link
            key={item.platform}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <span className="sr-only">View {item.platform} Account</span>
            <Icon />
          </Link>
        ))}
      </div>
    </div>
  );
}
