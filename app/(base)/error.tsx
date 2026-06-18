'use client';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';

import ErrorReportButton from '@/components/error-report-button';
import { Button } from '@/components/ui/button';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const getReportMessage = (error: ErrorPageProps['error']) =>
  [
    'Route error boundary rendered.',
    `Message: ${error.message || 'Unknown error'}`,
    error.digest ? `Digest: ${error.digest}` : null,
  ]
    .filter(Boolean)
    .join('\n');

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const reportMessage = getReportMessage(error);

  return (
    <div className="mt-8 flex flex-col items-center gap-8">
      <h1 className="text-4xl font-black">WHOOPS!</h1>
      <Image src="/error-graphic.png" alt="Fore!" height={212} width={206} />
      <h2 className="text-xl">Something went wrong...</h2>
      <div className="grid w-full max-w-sm gap-3 px-4">
        <Button onClick={reset} type="button">
          <RefreshCw className="mr-2 size-4" />
          Try again
        </Button>
        <ErrorReportButton message={reportMessage} />
      </div>
    </div>
  );
}
