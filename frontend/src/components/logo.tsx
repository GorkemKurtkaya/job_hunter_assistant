import darkLogo from "@/assets/logos/dark.svg";
import logo from "@/assets/logos/main.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-10 max-w-[12rem]">
      <Image
        src={logo}
        fill
        className="dark:hidden"
        alt="JOB HUNTER logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="JOB HUNTER logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
