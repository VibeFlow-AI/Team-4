import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedLayout from "@/components/ProtectedLayout";

function ProtectedPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Protected Page</CardTitle>
              <CardDescription>
                This page is only accessible to authenticated users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Congratulations! You have successfully accessed the protected route. 
                This demonstrates that the authentication system is working correctly.
              </p>
              
              <div className="flex gap-4">
                <Button onClick={() => navigate("/")}>
                  Go to Home
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}

export default ProtectedPage; 