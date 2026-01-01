'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Send,
  Shield,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/fleet', icon: Car, label: 'Fleet' },
  { href: '/requests', icon: ClipboardList, label: 'Requests' },
  { href: '/dispatch', icon: Send, label: 'Dispatch' },
  { href: '/admin', icon: Shield, label: 'Admin Panel' },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const avatarUrl = PlaceHolderImages.find((img) => img.id === 'avatar-1')?.imageUrl;
  
  const pageTitle = navItems.find(item => pathname === item.href)?.label || 'Samagam FleetConnect';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Logo />
            <h1 className="font-headline text-2xl font-bold group-data-[collapsible=icon]:hidden">FleetConnect</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <Link href="/login" legacyBehavior passHref>
              <SidebarMenuButton tooltip={{ children: 'Logout', side: 'right' }}>
                <LogOut />
                <span className='group-data-[collapsible=icon]:hidden'>Logout</span>
              </SidebarMenuButton>
            </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          <SidebarTrigger className="md:hidden"/>
          <h1 className="flex-1 text-xl font-semibold font-headline">{pageTitle}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="User Avatar" data-ai-hint="person portrait" />}
                  <AvatarFallback>
                    <User className="h-4 w-4"/>
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
