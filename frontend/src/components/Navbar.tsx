import Button from "./Button";

const Navbar = () => {
  return (
    <div className=" flex justify-between p-3 px-7 border border-slate-900">
      <div className=" font-bold text-xl flex justify-center items-center">
        Chess
      </div>
      <div className=" space-x-4 flex">
        <Button text="Sign In" styles=" w-28" variant="dark" />
        <Button text="Log In" styles=" w-28" />
      </div>
    </div>
  );
};

export default Navbar;
