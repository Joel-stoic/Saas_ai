import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import NavItems from './NavItems';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <nav className="navbar w-full bg-gray-900 text-gray-300 shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <Image src="/images/logo.svg" alt="logo" width={46} height={44} />
      </Link>

      {/* Nav and Auth */}
      <div className="flex items-center gap-6">
        <NavItems />

        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 hover:scale-105 transition-all duration-200">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
