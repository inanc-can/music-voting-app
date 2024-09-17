import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
const LogoutButton = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
