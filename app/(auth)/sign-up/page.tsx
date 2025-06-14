import { FormMessage, Message } from "@/components/form-message";
import { signUpAction } from '@/app/actions';

export default async function SignUpPage(props: {
  searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;

    return (
        <div className="relative w-full p-8 max-w-screen-sm">
            <h1 className="text-2xl mb-8 font-black">Join the Pick'Em</h1>
            <form className="flex flex-col gap-4">
                <h2>Login:</h2>
                <input type="email" name="email" className="w-full bg-background/75 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Email' />
                <input type="password" name="password" className="w-full bg-background/75 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Password' minLength={6}/>
                <input type="password" name="confirm_password" className="w-full bg-background/75 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Confirm Password'minLength={6} />
                <br/>
                <h2>Info:</h2>
                <input type="text" name="first_name" className="w-full bg-background/75 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='First Name' />
                <input type="text" name="last_name" className="w-full bg-background/75 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Last Name' />
                <br/>
                <button className="bg-brand-green text-black p-2 rounded-lg w-full" formAction={signUpAction}>Create Profile</button>
                <FormMessage message={searchParams} />
            </form>
        </div>
    )
}