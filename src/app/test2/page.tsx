import Spline from "@splinetool/react-spline";
export default function Page() {
  return (
    <div className="w-full">
      <Spline scene="https://prod.spline.design/QtyBj6g44cJyoslA/scene.splinecode" />
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Welcome to the Test Page</h1>
      </div>
    </div>
  );
}
