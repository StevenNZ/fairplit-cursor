import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-base font-semibold text-foreground">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">John Doe</p>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
          </div>
          <Separator className="bg-border" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">
                First name
              </Label>
              <Input
                defaultValue="John"
                className="h-10 bg-background border-border text-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">
                Last name
              </Label>
              <Input
                defaultValue="Doe"
                className="h-10 bg-background border-border text-foreground"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Email address
            </Label>
            <Input
              defaultValue="john@example.com"
              type="email"
              className="h-10 bg-background border-border text-foreground"
            />
          </div>
          <Button className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-base font-semibold text-foreground">
            Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Set a monthly budget to help track your spending goals.
          </p>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Budget amount ($)
            </Label>
            <Input
              defaultValue="2000"
              type="number"
              className="h-10 bg-background border-border text-foreground max-w-xs"
            />
          </div>
          <Button className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
            Update budget
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-card">
        <CardHeader>
          <CardTitle className="font-display text-base font-semibold text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="outline"
            className="w-fit border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
          >
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
