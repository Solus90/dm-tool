import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sword, Sparkles, BookOpen, Users, ScrollText, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">D&D 5e DM Tool</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Local-first dungeon master tool for tracking combat, managing campaigns, and organizing your D&D sessions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Quick Combat
            </CardTitle>
            <CardDescription>Simple initiative tracker - no campaign needed</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quick-combat">
              <Button className="w-full">Quick Combat</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Combat Tracker
            </CardTitle>
            <CardDescription>Full combat with HP, conditions, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/combat">
              <Button className="w-full" variant="outline">Combat Tracker</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Encounters
            </CardTitle>
            <CardDescription>Build and save encounter templates</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/encounters">
              <Button className="w-full" variant="outline">Manage Encounters</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Monsters
            </CardTitle>
            <CardDescription>Browse and manage monster stat blocks</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/monsters">
              <Button className="w-full" variant="outline">Monster Database</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Characters
            </CardTitle>
            <CardDescription>Manage player character sheets</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/characters">
              <Button className="w-full" variant="outline">Character Sheets</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Sessions
            </CardTitle>
            <CardDescription>Session notes and campaign timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sessions">
              <Button className="w-full" variant="outline">Session Notes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tools
            </CardTitle>
            <CardDescription>Reference tools and utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools">
              <Button className="w-full" variant="outline">Reference Tools</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
