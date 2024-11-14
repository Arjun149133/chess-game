import Button from "./Button";

const Navbar = () => {
  return (
    <div className=" flex justify-between p-3 px-7 border border-slate-900">
      <div className=" font-bold text-xl flex justify-center items-center">
        Chess
      </div>
      <div className=" space-x-4 flex">
        <Button styles=" w-28" variant="dark">
          Sign In
        </Button>
        <Button styles=" w-28">Log In</Button>
      </div>
    </div>
  );
};

export default Navbar;
