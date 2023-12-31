"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui-kits";

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
  signinUrlParams?: Record<string, string> | undefined;
};

type Providers = Record<string, Provider>;

export default function AuthProviders() {
  // Dictionary of providers
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();

      // Update providers state
      setProviders(res);
    };

    fetchProviders();
  }, []);

  if (providers) {
    return (
      <div>
        {Object.values(providers).map((provider: Provider, i) => (
          <Button
            key={i}
            title="Sign In"
            handleClick={() => signIn(provider?.id)}
          />
        ))}
      </div>
    );
  }
}
