'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type LoginErrorNotificationProps = {
  message: string;
};

export default function LoginErrorNotification({
  message,
}: LoginErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-md border border-destructive bg-background p-4 text-foreground shadow-lg shadow-black/40"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-destructive-foreground"
        />
        <div className="grid gap-1 pr-6">
          <h2 className="text-sm font-bold">Sign in failed</h2>
          <p className="text-sm text-destructive-foreground">{message}</p>
        </div>
        <Button
          aria-label="Dismiss sign in error"
          className="absolute right-2 top-2 size-8 text-foreground"
          onClick={() => setIsVisible(false)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
