"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  personal_website: string | null;
  summary: string;
  skills: string[];
  soft_skills: string[];
  created_at: string;
  updated_at: string;
}

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcı bilgilerini getir
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.profile);
      } else if (response.status === 401) {
        // Token geçersiz veya yok
        setUser(null);
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri getirilemedi:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout fonksiyonu
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        setIsOpen(false);
        toast.success('Başarıyla çıkış yapıldı!');
        // Ana sayfaya yönlendir
        window.location.href = '/auth/sign-in';
      } else {
        toast.error('Çıkış yapılırken hata oluştu');
      }
    } catch (error) {
      console.error('Logout hatası:', error);
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  // Component mount olduğunda kullanıcı bilgilerini getir
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Loading durumu
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="size-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="hidden lg:block">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa login butonu göster
  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
      >
        <UserIcon />
        <span>Giriş Yap</span>
      </Link>
    );
  }

  // Kullanıcı giriş yapmışsa user info göster
  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
            {user.full_name.split(' ').map(n => n[0]).join('')}
          </div>
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{user.full_name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <div className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
            {user.full_name.split(' ').map(n => n[0]).join('')}
          </div>

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {user.full_name}
            </div>

            <div className="leading-none text-gray-6">{user.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">Profilim</span>
          </Link>

        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Çıkış Yap</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
