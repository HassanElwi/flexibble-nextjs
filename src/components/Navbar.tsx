import { NavLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import AuthProviders from "./AuthProviders";
import { getCurrentUser } from "@/lib/session";
import ProfileMenu from "./ProfileMenu";

export default async function Navbar() {
  const session = await getCurrentUser();

  return (
    <nav className="flexBetween navbar">
      {/* App logo */}
      <Link href="/">
        <Image src="/logo.svg" width={116} height={43} alt="Flexibble" />
      </Link>

      {/* Navbar links */}
      <ul className="xl:flex hidden text-small gap-7">
        {NavLinks.map((item) => (
          <Link href={item.href} key={item.key}>
            {item.text}
          </Link>
        ))}
      </ul>

      <div className="flexCenter gap-4">
        {session?.user ? (
          <>
            <ProfileMenu session={session} />

            <Link href="/create-project">Share Work</Link>
          </>
        ) : (
          <AuthProviders />
        )}
      </div>
    </nav>
  );
}
