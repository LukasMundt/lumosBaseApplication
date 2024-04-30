import { Progress } from "flowbite-react";

export default function Show_Status({ status, className = "" }) {
  return (
    <div className={"mb-9 " + className}>
      <Progress
        color="dark"
        progress={25}
        textLabel={<span className="text-gray-800">{status}</span>}
        labelText
        size="lg"
      />
    </div>
  );
}
