import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Avatar from "./Avatar";
import { nanoid } from "nanoid";

export default function Account({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, full_name, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setFullName(data.full_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, full_name, avatar_url }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        full_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-light text-sm">
      This is the Account page. You can update your profile here. (Temporary
      page for testing purposes.)
      <div>
        <Avatar
          uid={nanoid()}
          url={avatarUrl}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({ username, full_name: fullName, avatar_url: url });
          }}
        />
      </div>
      <div className="flex gap-x-2">
        <div>Email:</div>
        <div className="font-normal text-gray-400">{session.user.email}</div>
      </div>
      <div className="flex gap-x-2">
        <div>Username</div>
        <input
          className="border-b outline-none"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex gap-x-2">
        <div>Full Name</div>
        <input
          className="border-b outline-none"
          value={fullName || ""}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="flex gap-x-2 mt-4">
        <button
          className="bg-blue-500 text-white rounded-md px-2 py-1"
          onClick={() =>
            updateProfile({
              username,
              full_name: fullName,
              avatar_url: avatarUrl,
            })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
        <button
          className="border border-blue-500 text-blue-500 rounded-md px-2 py-1"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
