"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { isAuthenticated, isInitialized, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Client-side mounting kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleExpanded = useCallback((title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  }, []);

  // Logout fonksiyonu
  const handleLogout = async () => {
    try {
      await logout();
      // Ana sayfaya yönlendir
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }

            // Break the loop
            return true;
          }
        });
      });
    });
  }, [pathname, expandedItems, toggleExpanded]);

  // Authentication durumuna göre menü öğelerini filtrele
  const filteredNavData = NAV_DATA.map(section => ({
    ...section,
    items: section.items.filter(item => {
      // Dashboard ve Profile sadece giriş yapılmışsa göster
      if (item.title === "Dashboard" || item.title === "Profile") {
        return mounted && isInitialized && isAuthenticated;
      }
      // Authentication sadece giriş yapılmamışsa göster
      if (item.title === "Authentication") {
        return mounted && isInitialized && !isAuthenticated;
      }
      // Diğer menü öğeleri her zaman göster
      return true;
    })
  }));

  // Server-side rendering sırasında tüm menüyü göster
  if (!mounted || !isInitialized) {
    return (
      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>
          </div>
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>
                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <button
                            onClick={() => toggleExpanded(item.title)}
                            className="flex w-full items-center justify-between rounded-lg px-3.5 py-3 font-medium text-dark-4 transition-all duration-200 hover:bg-gray-100 hover:text-dark dark:text-dark-6 hover:dark:bg-[#FFFFFF1A] hover:dark:text-white"
                          >
                            <span className="flex items-center gap-3">
                              <item.icon />
                              {item.title}
                            </span>
                            <ChevronUp
                              className={cn(
                                "rotate-180 transition-transform",
                                expandedItems.includes(item.title) && "rotate-0",
                              )}
                            />
                          </button>
                        ) : (
                          <Link
                            href={item.url || "#"}
                            className="flex items-center gap-3 rounded-lg px-3.5 py-3 font-medium text-dark-4 transition-all duration-200 hover:bg-gray-100 hover:text-dark dark:text-dark-6 hover:dark:bg-[#FFFFFF1A] hover:dark:text-white"
                          >
                            <item.icon />
                            {item.title}
                          </Link>
                        )}
                        
                        {item.items.length > 0 && expandedItems.includes(item.title) && (
                          <ul className="mt-2 space-y-1 pl-8">
                            {item.items.map((subItem) => (
                              <li key={subItem.title}>
                                <Link
                                  href={subItem.url}
                                  className="block rounded-lg px-3.5 py-2 text-sm font-medium text-dark-4 transition-all duration-200 hover:bg-gray-100 hover:text-dark dark:text-dark-6 hover:dark:bg-[#FFFFFF1A] hover:dark:text-white"
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {filteredNavData.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />

                              <span>{item.title}</span>

                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    {subItem.title === "Logout" ? (
                                      <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium text-dark-4 transition-all duration-200 hover:bg-gray-100 hover:text-dark dark:text-dark-6 hover:dark:bg-[#FFFFFF1A] hover:dark:text-white"
                                      >
                                        <span>{subItem.title}</span>
                                      </button>
                                    ) : (
                                      <MenuItem
                                        as="link"
                                        href={subItem.url}
                                        isActive={pathname === subItem.url}
                                      >
                                        <span>{subItem.title}</span>
                                      </MenuItem>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/" +
                                  item.title.toLowerCase().split(" ").join("-");

                            return (
                              <MenuItem
                                className="flex items-center gap-3 py-3"
                                as="link"
                                href={href}
                                isActive={pathname === href}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{item.title}</span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
