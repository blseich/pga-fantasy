'use client';

import { OctagonAlert, RefreshCw } from 'lucide-react';

import ErrorReportButton from '@/components/error-report-button';
import { Button } from '@/components/ui/button';

type ClientErrorPopupProps = {
  message: string;
  onRefresh?: () => void;
  reportEmail?: string;
};

export default function ClientErrorPopup({
  message,
  onRefresh = () => window.location.reload(),
  reportEmail = process.env.NEXT_PUBLIC_ERROR_REPORT_EMAIL,
}: ClientErrorPopupProps) {
  return (
    <div
      aria-modal="true"
      className="fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center bg-black/75 p-4"
      role="dialog"
    >
      <div className="relative mx-auto grid w-full max-w-sm gap-4 rounded-md border-2 border-destructive bg-background p-6 text-center">
        <OctagonAlert
          aria-hidden="true"
          className="mx-auto text-destructive"
          size={64}
        />
        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-destructive-foreground">{message}</p>
        </div>
        <div className="grid grid-rows-[auto_1fr] gap-2">
          <Button onClick={onRefresh} type="button">
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
          <ErrorReportButton message={message} reportEmail={reportEmail} />
        </div>
      </div>
    </div>
  );
}
