
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  About SwipeHire AI
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  We are a team of passionate developers and designers who believe
                  that everyone deserves a chance to land their dream job. We are
                  dedicated to creating a platform that empowers job seekers to
                  showcase their skills and experience in the best possible
                  light.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Our Mission
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Our mission is to level the playing field for job seekers by
                  providing them with the tools and resources they need to
                  succeed in today&apos;s competitive job market.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Meet the Team
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We are a small, dedicated team that is passionate about
                  helping people achieve their career goals.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <Card>
                  <CardHeader>
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <CardTitle>Jane Doe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Co-Founder and CEO
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <CardTitle>John Doe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Co-Founder and CTO
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <CardTitle>Jane Smith</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Lead Designer
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
