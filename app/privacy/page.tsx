
export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground md:text-xl">
                This privacy policy will help you understand how we use and
                protect the data you provide to us when you visit and use our
                website.
              </p>
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                What User Data We Collect
              </h2>
              <p className="text-muted-foreground">
                When you visit the website, we may collect the following
                information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Your IP address.</li>
                <li>Your contact information and email address.</li>
                <li>Other information such as interests and preferences.</li>
                <li>Data profile regarding your online behavior on our website.</li>
              </ul>
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                Why We Collect Your Data
              </h2>
              <p className="text-muted-foreground">
                We are collecting your data for several reasons:
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>To better understand your needs.</li>
                <li>To improve our services and products.</li>
                <li>
                  To send you promotional emails containing the information we
                  think you will find interesting.
                </li>
                <li>
                  To contact you to fill out surveys and participate in other
                  types of market research.
                </li>
                <li>
                  To customize our website according to your online behavior and
                  personal preferences.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
