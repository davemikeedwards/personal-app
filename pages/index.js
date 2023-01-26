import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../components/Account";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="p-2">
      {!session ? (
        <div className="flex w-full justify-center h-screen items-center">
          <div className="flex flex-col items-center">
            <div className="">
              <h1 className="text-2xl font-bold">Supabase Auth UI</h1>
              <p>Login using Supabase Auth</p>
            </div>
            <div className="flex flex-col max-w-sm">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Account session={session} />
      )}
    </div>
  );
};

export default Home;
