import { useEffect, useState } from "react";

const Profile = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">Profile</h1>
      <p>Username: {username}</p>
    </div>
  );
};

export default Profile;
