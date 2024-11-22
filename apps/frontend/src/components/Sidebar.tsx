import { Button } from "./ui/button";

const Sidebar = () => {
  return (
    <div className=" bg-dark flex flex-col items-center h-screen">
      <div className=" m-2 p-2">
        <h1 className=" text-white text-2xl font-bold p-4">Chess</h1>
      </div>
      <div className=" flex flex-col space-y-4">
        <Button className="bg-green-800 hover:bg-green-700">Login</Button>
        <Button className=" bg-white hover:bg-green-100 text-black">
          Register
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
