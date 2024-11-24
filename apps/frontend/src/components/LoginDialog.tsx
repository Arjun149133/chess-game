import CustomButton from "./Button";
import { Button } from "./ui/button";

const LoginDialog = () => {
  return (
    <>
      <div className=" h-screen w-screen absolute bg-dark opacity-80"></div>
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-fit md:w-72 min-w-fit rounded-lg p-8 bg-dark">
        <div className=" flex flex-col gap-4">
          <CustomButton variant="secondary" className=" py-6">
            Register
          </CustomButton>{" "}
          <CustomButton className=" py-6">Login</CustomButton>
          <Button
            variant="ghost"
            className=" hover:bg-transparent hover:text-slate-300 md:text-lg"
          >
            Play as a Guest
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginDialog;
