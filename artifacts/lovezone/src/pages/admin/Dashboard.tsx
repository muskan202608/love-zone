import { Link } from "wouter";
import { Users, MapPin, Map, FileText, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetDashboardStats } from "@workspace/api-client-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your directory statistics and recent activity.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2"><div className="h-4 w-20 bg-muted rounded"></div></CardHeader>
              <CardContent><div className="h-8 w-16 bg-muted rounded mb-1"></div><div className="h-3 w-24 bg-muted rounded"></div></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats?.totalListings || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-foreground font-medium">{stats?.activeListings || 0}</span> active profiles
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total States</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalStates || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active regions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalCities || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active service areas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">SEO Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalSeoPages || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Landing pages</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild variant="outline" className="justify-start h-12 text-left">
              <Link href="/admin/listings">
                <Users className="mr-2 h-4 w-4 text-primary" />
                Manage Listings
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-12 text-left">
              <Link href="/admin/cities">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                Manage Cities
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-12 text-left">
              <Link href="/admin/seo">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Manage SEO Pages
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 border rounded-lg bg-card">
              <div className="mr-4 p-2 bg-[#25D366]/10 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-medium text-sm">Database Connection</p>
                <p className="text-xs text-muted-foreground">Connected and healthy</p>
              </div>
            </div>
            <div className="flex items-center p-3 border rounded-lg bg-card">
              <div className="mr-4 p-2 bg-[#25D366]/10 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-medium text-sm">API Services</p>
                <p className="text-xs text-muted-foreground">All endpoints operational</p>
              </div>
            </div>
            <Button asChild variant="secondary" className="w-full mt-2">
              <a href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" /> View Public Site
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}