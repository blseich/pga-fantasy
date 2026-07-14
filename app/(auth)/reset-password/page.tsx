import Link from 'next/link';

import { resetPasswordAction } from '@/app/(base)/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ('success' in searchParams) {
    return (
      <div className="grid h-screen place-items-center">
        <div className="flex w-full max-w-md flex-col gap-4 p-4">
          <h1 className="text-2xl font-medium">Password updated</h1>
          <FormMessage message={searchParams} />
          <Button asChild>
            <Link href="/sign-in">Return to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen place-items-center">
      <form className="flex w-full max-w-md flex-col gap-2 p-4 [&>input]:mb-4">
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">
          Please enter your new password below.
        </p>
        <Label htmlFor="password">New password</Label>
        <Input
          type="password"
          name="password"
          placeholder="New password"
          required
        />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
        />
        <SubmitButton formAction={resetPasswordAction}>
          Reset password
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
