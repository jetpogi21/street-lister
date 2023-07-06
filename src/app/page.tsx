import Map from "@/components/map/Map";

export const metadata = {
  title: "Street Lister",
  description: "This is a basic home page",
};

export default function Page() {
  return (
    <div className="flex flex-1 w-full max-w-screen-lg gap-16 mx-auto">
      <Map />
    </div>
  );
}
