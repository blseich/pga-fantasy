import { signUpAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';

export default async function SignUpPage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="relative w-full max-w-screen-sm p-8">
      <h1 className="mb-8 text-2xl font-black">Join the Pick&apos;Em</h1>
      <form className="flex flex-col gap-4">
        <h2>Login:</h2>
        <input
          type="email"
          name="email"
          className="w-full border-2 border-solid border-brand-blue bg-background/75 p-2 text-foreground"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          className="w-full border-2 border-solid border-brand-blue bg-background/75 p-2 text-foreground"
          placeholder="Password"
          minLength={6}
        />
        <input
          type="password"
          name="confirm_password"
          className="w-full border-2 border-solid border-brand-blue bg-background/75 p-2 text-foreground"
          placeholder="Confirm Password"
          minLength={6}
        />
        <br />
        <h2>Info:</h2>
        <input
          type="text"
          name="first_name"
          className="w-full border-2 border-solid border-brand-blue bg-background/75 p-2 text-foreground"
          placeholder="First Name"
        />
        <input
          type="text"
          name="last_name"
          className="w-full border-2 border-solid border-brand-blue bg-background/75 p-2 text-foreground"
          placeholder="Last Name"
        />
        <br />
        <button
          className="w-full rounded-lg bg-brand-green p-2 text-black"
          formAction={signUpAction}
        >
          Create Profile
        </button>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
