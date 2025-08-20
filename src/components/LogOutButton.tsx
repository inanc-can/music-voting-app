import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Remove from party participants
        const { error: leaveError } = await supabase
          .from("partyparticipants")
          .delete()
          .eq("user_id", user.id);

        if (leaveError) {
          console.error("Error leaving party:", leaveError);
        }
      }

      // Sign out
      await supabase.auth.signOut();
      
      // Redirect to home
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
      window.location.reload();
    }
  };

  return (
    <Button variant={"secondary"} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
