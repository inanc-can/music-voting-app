import NavBar from "@/components/NavBar";
import Table from "@/components/Table";

export default async function Home() {
  return (
    <div className="min-h-screen min-w-screen relative">
      <div className="mx-8 my-4">
        <Table />
      </div>
      <NavBar />
    </div>
  );
}
